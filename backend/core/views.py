from rest_framework import generics, status, parsers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Tenant
from .serializers import TenantSerializer

class TenantProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve and update the current tenant's profile.
    Only accessible by users associated with the tenant.
    """
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_object(self):
        # 1. Try identifying via request.tenant (set by middleware if using session/subdomain)
        tenant = getattr(self.request, 'tenant', None)
        
        # 2. Fallback: Check the authenticated user's profile
        if not tenant and self.request.user.is_authenticated:
            profile = getattr(self.request.user, 'profile', None)
            if profile and profile.organization:
                tenant = profile.organization
        
        # 3. Last fallback: For superusers, take the first tenant
        if not tenant and self.request.user.is_superuser:
            tenant = Tenant.objects.first()
            
        return tenant

    def patch(self, request, *args, **kwargs):
        # Allow partial updates for branding/contact info
        return self.partial_update(request, *args, **kwargs)
