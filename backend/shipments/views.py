from rest_framework import viewsets, permissions
from core.utils import TenantMixin
from .models import PrasadShipment
from .serializers import PrasadShipmentSerializer

class PrasadShipmentViewSet(TenantMixin, viewsets.ModelViewSet):
    model = PrasadShipment
    queryset = PrasadShipment.objects.all()
    serializer_class = PrasadShipmentSerializer
    permission_classes = [permissions.AllowAny]
