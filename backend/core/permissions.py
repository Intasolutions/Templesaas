from rest_framework import permissions

class ModulePermission(permissions.BasePermission):
    """
    Highly granular permission check for SaaS Modules.
    Checks user.profile.module_permissions for 'view', 'edit', 'delete'.
    """
    message = "DEBUG: Module Permission Denied"
    
    # Map app labels/URL prefixes to module IDs if they differ
    MODULE_MAP = {
        'shipments': 'shipments',
        'shipping': 'shipments',
        'pooja': 'pooja',
        'bookings': 'bookings',
        'donations': 'donations',
        'hundi': 'hundi',
        'inventory': 'inventory',
        'finance': 'finance',
        'events': 'events',
        'staff': 'staff',
        'users': 'users',
        'devotees': 'devotees',
        'assets': 'assets',
        'integrations': 'integrations',
        'tv': 'tv',
    }

    # Paths that should always be accessible to authenticated users
    WHITELISTED_PATHS = [
        'users/me',
        'users/profile',
        'core/profile',
        'core/profile-image',
        'core/billing',
        'core/subscription-requests',
    ]

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # Identify Tenant
        tenant = getattr(request, "tenant", None)
        if not tenant:
            profile = getattr(user, 'profile', None)
            if profile:
                tenant = profile.organization

        # 1. Superusers and Temple Admins have full access
        profile = getattr(user, 'profile', None)
        
        # LOGGING
        print(f"--- Permission Check ---")
        print(f"User: {user.username}")
        print(f"Path: {request.path}")
        print(f"Role: {profile.role if profile else 'No Profile'}")
        print(f"Tenant: {tenant.name if tenant else 'No Tenant'}")
        if tenant:
             print(f"Tenant Status: {tenant.status}")

        if user.is_superuser or (profile and profile.role == 'temple_admin') or (profile and profile.module_permissions.get('all')):
            print("Decision: ALLOWED (Admin/All)")
            return True

        # ── SaaS Paywall Check ─────────────────────────────────────────────
        if not user.is_superuser and tenant:
            from core.models import Tenant
            restricted_statuses = [
                Tenant.STATUS_APPROVED, 
                Tenant.STATUS_PENDING_APPROVAL, 
                Tenant.STATUS_EXPIRED
            ]
            
            if tenant.status in restricted_statuses:
                path = request.path.strip('/')
                is_whitelisted = any(wp in path for wp in self.WHITELISTED_PATHS)
                if not is_whitelisted:
                    self.message = f"DEBUG: Paywall Denied ({tenant.status})"
                    print(f"Decision: FORBIDDEN (Paywall: {tenant.status})")
                    return False

        if not profile:
            self.message = "DEBUG: No Profile"
            print("Decision: FORBIDDEN (No Profile)")
            return False

        # 2. Extract module name from URL
        path = request.path.strip('/')
        
        # Check whitelist first
        for white_path in self.WHITELISTED_PATHS:
            if white_path in path:
                print("Decision: ALLOWED (Whitelist)")
                return True

        path_parts = path.split('/')
        module_id = None
        
        # Detect module from /api/<module>/...
        if len(path_parts) > 1 and path_parts[0] == 'api':
            app_name = path_parts[1]
            module_id = self.MODULE_MAP.get(app_name)
        
        # If we can't identify a specific module, we allow SAFE methods (View only)
        # but block destructive ones just in case.
        if not module_id:
            res = request.method in permissions.SAFE_METHODS
            if not res:
                self.message = "DEBUG: Non-safe method on unknown module"
            print(f"Decision: {'ALLOWED' if res else 'FORBIDDEN'} (No Module ID, Safe Method Check)")
            return res
        
        perms = profile.module_permissions.get(module_id, [])
        print(f"Module: {module_id}, User Perms: {perms}")

        # 3. Method-based Check
        if request.method in permissions.SAFE_METHODS:
            res = 'view' in perms
            if not res:
                self.message = f"DEBUG: Missing 'view' permission for {module_id}"
            print(f"Decision: {'ALLOWED' if res else 'FORBIDDEN'} (Safe Method: view)")
            return res
        
        if request.method in ['POST', 'PUT', 'PATCH']:
            res = 'edit' in perms
            if not res:
                self.message = f"DEBUG: Missing 'edit' permission for {module_id}"
            print(f"Decision: {'ALLOWED' if res else 'FORBIDDEN'} (Write Method: edit)")
            return res
            
        if request.method == 'DELETE':
            res = 'delete' in perms
            if not res:
                self.message = f"DEBUG: Missing 'delete' permission for {module_id}"
            print(f"Decision: {'ALLOWED' if res else 'FORBIDDEN'} (Delete Method: delete)")
            return res

        self.message = "DEBUG: Permission Fallthrough"
        print("Decision: FORBIDDEN (Fallthrough)")
        return False
