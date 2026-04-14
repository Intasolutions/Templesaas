from rest_framework import generics
from .models import Transaction
from .serializers import TransactionSerializer


class TenantScopedQuerysetMixin:
    def get_tenant(self):
        return getattr(self.request, "tenant", None)

    def get_queryset(self):
        tenant = self.get_tenant()
        qs = super().get_queryset()
        if tenant:
            return qs.filter(organization=tenant)
        return qs.none()


class TransactionListCreateView(TenantScopedQuerysetMixin, generics.ListCreateAPIView):
    queryset = Transaction.objects.all().order_by("-date", "-id")
    serializer_class = TransactionSerializer

    def perform_create(self, serializer):
        serializer.save(organization=self.get_tenant())


class TransactionDetailView(TenantScopedQuerysetMixin, generics.RetrieveUpdateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
