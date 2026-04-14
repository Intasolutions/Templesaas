from rest_framework import viewsets, permissions
from .models import Asset, AssetCategory, MaintenanceLog
from .serializers import AssetSerializer, AssetCategorySerializer, MaintenanceLogSerializer

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by("-valuation")
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if tenant:
            return self.queryset.filter(organization=tenant)
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(organization=self.request.tenant)

class AssetCategoryViewSet(viewsets.ModelViewSet):
    queryset = AssetCategory.objects.all()
    serializer_class = AssetCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
         tenant = getattr(self.request, 'tenant', None)
         if tenant:
             return self.queryset.filter(organization=tenant)
         return self.queryset.none()

class MaintenanceLogViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceLog.objects.all().order_by("-service_date")
    serializer_class = MaintenanceLogSerializer
    permission_classes = [permissions.IsAuthenticated]
