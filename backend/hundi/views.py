from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from core.permissions import ModulePermission
from core.utils import TenantMixin
from .models import HundiSession, HundiCollection
from .serializers import HundiSessionSerializer, HundiCollectionSerializer

class HundiSessionListCreateView(TenantMixin, generics.ListCreateAPIView):
    queryset = HundiSession.objects.all()
    serializer_class = HundiSessionSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

    def get_queryset(self):
        qs = super().get_queryset().prefetch_related("witnesses").order_by("-id")
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            qs = qs.filter(opening_date__gte=start_date)
        if end_date:
            qs = qs.filter(opening_date__lte=end_date)
        return qs

class HundiSessionDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = HundiSession
    queryset = HundiSession.objects.prefetch_related("witnesses", "collections").all()
    serializer_class = HundiSessionSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

class HundiCollectionListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = HundiCollection
    queryset = HundiCollection.objects.all()
    serializer_class = HundiCollectionSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

class HundiCollectionDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = HundiCollection
    queryset = HundiCollection.objects.select_related("session").all()
    serializer_class = HundiCollectionSerializer
    permission_classes = [IsAuthenticated, ModulePermission]
