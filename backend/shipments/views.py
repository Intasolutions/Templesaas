from rest_framework import viewsets, permissions
from core.permissions import ModulePermission
from core.utils import TenantMixin
from .models import PrasadShipment, PrasadamItem
from .serializers import PrasadShipmentSerializer, PrasadamItemSerializer

class PrasadShipmentViewSet(TenantMixin, viewsets.ModelViewSet):
    model = PrasadShipment
    queryset = PrasadShipment.objects.all()
    serializer_class = PrasadShipmentSerializer
    permission_classes = [permissions.IsAuthenticated, ModulePermission]

class PrasadamItemViewSet(TenantMixin, viewsets.ModelViewSet):
    model = PrasadamItem
    queryset = PrasadamItem.objects.all()
    serializer_class = PrasadamItemSerializer
    permission_classes = [permissions.IsAuthenticated, ModulePermission]
