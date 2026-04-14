import os
from django.conf import settings
from django.http import JsonResponse
from .models import Tenant, Plan
from .tenant_context import set_current_tenant_db, clear_current_tenant_db

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tenant = None
        
        # 1. Try identifying via logged-in user (Secure SaaS approach)
        if request.user.is_authenticated:
            try:
                # Check UserProfile for organization
                if hasattr(request.user, 'profile') and request.user.profile.organization:
                    tenant = request.user.profile.organization
            except Exception:
                pass

        # 2. Fallback to Header/Subdomain (Public pages or initialization)
        if not tenant:
            tenant_code = request.headers.get("X-Tenant-Code")
            hostname = request.get_host().split(":")[0]
            
            if not tenant_code and "." in hostname:
                tenant_code = hostname.split(".")[0]
                
            if tenant_code and tenant_code not in ["www", "localhost", "127.0.0.1"]:
                try:
                    tenant = Tenant.objects.get(subdomain=tenant_code)
                except Tenant.DoesNotExist:
                    pass

        request.tenant = tenant
        
        # 3. Plan-based Access Control
        if tenant:
            # ── Check Trial Expiration ───────────────────────────────────
            from django.utils import timezone
            if tenant.is_trial and tenant.trial_ends_at and timezone.now() > tenant.trial_ends_at:
                return JsonResponse(
                    {
                        "error": "Trial Expired",
                        "message": "Your 7-day free trial has concluded. Please upgrade to a premium plan to continue using the platform.",
                        "trial_expired": True
                    },
                    status=403
                )

            allowed_apps = tenant.plan.allowed_apps if (tenant.plan and hasattr(tenant.plan, 'allowed_apps')) else []
            path_parts = request.path.strip("/").split("/")
            if len(path_parts) > 1 and path_parts[0] == "api":
                requested_app = path_parts[1]
                # core, users, and reports are always allowed
                if requested_app not in allowed_apps and requested_app not in ["core", "users", "reports", "tenants"]:
                     return JsonResponse(
                         {"error": f"Access Denied: Your {tenant.plan.name} plan does not include the '{requested_app}' module."},
                         status=403
                     )

        return self.get_response(request)
