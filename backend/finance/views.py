from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from core.permissions import ModulePermission
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
    permission_classes = [IsAuthenticated, ModulePermission]

    def perform_create(self, serializer):
        serializer.save(organization=self.get_tenant())


from rest_framework.decorators import api_view, permission_classes
from django.db.models import Sum
from rest_framework.response import Response

class TransactionDetailView(TenantScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

@api_view(["GET"])
@permission_classes([IsAuthenticated, ModulePermission])
def finance_summary(request):
    tenant = getattr(request, "tenant", None)
    if not tenant:
        return Response({"error": "No organization found"}, status=400)

    txns = Transaction.objects.filter(organization=tenant)

    totals = txns.aggregate(
        total_income=Sum("amount", filter=models.Q(txn_type=Transaction.TYPE_INCOME)),
        total_expense=Sum("amount", filter=models.Q(txn_type=Transaction.TYPE_EXPENSE))
    )

    income_by_cat = txns.filter(txn_type=Transaction.TYPE_INCOME).values("category").annotate(total=Sum("amount"))
    expense_by_cat = txns.filter(txn_type=Transaction.TYPE_EXPENSE).values("category").annotate(total=Sum("amount"))

    income = totals["total_income"] or 0
    expense = totals["total_expense"] or 0
    profit = income - expense

    return Response({
        "total_income": income,
        "total_expense": expense,
        "net_profit": profit,
        "income_by_category": income_by_cat,
        "expense_by_category": expense_by_cat,
    })
