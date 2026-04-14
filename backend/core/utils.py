from rest_framework import permissions

class TenantMixin:
    """
    Mixin for DRF Generic Views to automatically:
    1. Filter queryset by current request.tenant
    2. Inject request.tenant into the organization field on create/update.
    """
    def get_queryset(self):
        qs = super().get_queryset()
        tenant = getattr(self.request, 'tenant', None)
        
        # If it's a superuser or specifically allowed public access, return all
        if self.request.user.is_superuser:
            return qs
            
        if tenant:
            # Check if model has organization or tenant field
            if hasattr(self.model, 'organization'):
                return qs.filter(organization=tenant)
            elif hasattr(self.model, 'tenant'):
                return qs.filter(tenant=tenant)
        
        # If no tenant identified, return empty
        return qs.none()

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        if tenant:
            if hasattr(serializer.Meta.model, 'organization'):
                serializer.save(organization=tenant)
            elif hasattr(serializer.Meta.model, 'tenant'):
                serializer.save(tenant=tenant)
            else:
                serializer.save()
        else:
            serializer.save()

def get_tenant_from_request(request):
    return getattr(request, 'tenant', None)
