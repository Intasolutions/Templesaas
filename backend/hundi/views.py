from rest_framework import generics
from rest_framework.permissions import AllowAny
from core.utils import TenantMixin
from .models import HundiSession, HundiCollection
from .serializers import HundiSessionSerializer, HundiCollectionSerializer

class HundiSessionListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = HundiSession
    serializer_class = HundiSessionSerializer
    permission_classes = [AllowAny]

class HundiSessionDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = HundiSession
    queryset = HundiSession.objects.prefetch_related("witnesses", "collections").all()
    serializer_class = HundiSessionSerializer
    permission_classes = [AllowAny]

class HundiCollectionListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = HundiCollection
    serializer_class = HundiCollectionSerializer
    permission_classes = [AllowAny]

class HundiCollectionDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = HundiCollection
    queryset = HundiCollection.objects.select_related("session").all()
    serializer_class = HundiCollectionSerializer
    permission_classes = [AllowAny]
