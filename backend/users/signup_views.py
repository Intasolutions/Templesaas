"""
Tenant Signup API - Phase 2
Creates Tenant + Plan + Admin User atomically in a single transaction.
On success returns a token for immediate login (no extra step needed).
"""

from django.db import transaction
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.authtoken.models import Token
from core.models import Tenant, Plan
from users.models import UserProfile
import re


def _slugify(text):
    """Basic slug: lowercase, strip non-alphanumeric, replace spaces with dashes."""
    slug = text.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug[:63]


class TenantSignupView(APIView):
    """
    POST /api/users/signup/
    Body: { temple_name, subdomain, email, password, admin_name? }
    Creates: Tenant (with LITE plan) + Django User + UserProfile (temple_admin role)
    Returns: { token, user, tenant } — same shape as LoginView so frontend reuses.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        temple_name = data.get('temple_name', '').strip()
        subdomain = data.get('subdomain', '').strip().lower()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        admin_name = data.get('admin_name', '').strip()
        plan_name = data.get('plan_name', Plan.LITE).upper()

        # ── Validation ──────────────────────────────────────────────────
        errors = {}
        if not temple_name:
            errors['temple_name'] = 'Temple name is required.'
        if not subdomain:
            errors['subdomain'] = 'Subdomain is required.'
        elif not re.match(r'^[a-z0-9-]+$', subdomain):
            errors['subdomain'] = 'Only lowercase letters, numbers, and hyphens allowed.'
        if not email:
            errors['email'] = 'Email is required.'
        if not password or len(password) < 8:
            errors['password'] = 'Password must be at least 8 characters.'
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

        # ── Uniqueness checks ───────────────────────────────────────────
        if Tenant.objects.filter(subdomain=subdomain).exists():
            return Response(
                {'errors': {'subdomain': f'"{subdomain}" is already taken. Please choose another.'}},
                status=status.HTTP_409_CONFLICT
            )
        if User.objects.filter(email=email).exists():
            return Response(
                {'errors': {'email': 'An account with this email already exists.'}},
                status=status.HTTP_409_CONFLICT
            )

        # ── Atomic creation ─────────────────────────────────────────────
        try:
            with transaction.atomic():
                # Get the requested plan (fallback to LITE if not found)
                target_plan = Plan.objects.filter(name=plan_name).first()
                if not target_plan:
                    target_plan = Plan.objects.filter(name=Plan.LITE).first()

                # 1. Create Tenant
                tenant = Tenant.objects.create(
                    name=temple_name,
                    subdomain=subdomain,
                    db_name=f"tenant_{subdomain.replace('-', '_')}",
                    contact_email=email,
                    plan=target_plan,
                    is_active=True,
                    is_trial=True # Everyone starts with a trial
                )

                # 2. Create Django User  (username = subdomain for uniqueness)
                username = subdomain
                # Handle edge case: username collision
                if User.objects.filter(username=username).exists():
                    username = f"{subdomain}_{User.objects.count()}"

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=admin_name.split(' ')[0] if admin_name else '',
                    last_name=' '.join(admin_name.split(' ')[1:]) if admin_name else '',
                )

                # 3. Attach UserProfile with temple_admin role
                profile = UserProfile.objects.get(user=user)
                profile.organization = tenant
                profile.role = UserProfile.ROLE_TEMPLE_ADMIN
                profile.save()

                # 4. Elite Automated Provisioning (Starter Pack)
                try:
                    from pooja.models import Pooja
                    Pooja.objects.create(
                        organization=tenant,
                        name_en="Sahasranama Archana",
                        name_ml="സഹസ്രനാമ അർച്ചന",
                        rate=100.00,
                        is_active=True
                    )
                except Exception as provisioning_error:
                    print(f"Provisioning warning: {provisioning_error}")

                # 5. Generate auth token
                token, _ = Token.objects.get_or_create(user=user)

        except Exception as e:
            return Response(
                {'errors': {'non_field': f'Signup failed: {str(e)}'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # ── Response (same shape as LoginView) ──────────────────────────
        from core.serializers import TenantSerializer
        from users.serializers import UserProfileSerializer

        return Response({
            'token': token.key,
            'user': UserProfileSerializer(profile).data,
            'tenant': TenantSerializer(tenant).data,
        }, status=status.HTTP_201_CREATED)
