from datetime import datetime

from django.db.models import Sum, F
from rest_framework import generics, filters, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.permissions import ModulePermission
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFromToRangeFilter, CharFilter

from core.utils import TenantMixin
from .models import Item, ItemCategory, StockTransaction
from .serializers import (
    ItemSerializer,
    ItemCategorySerializer,
    StockTransactionSerializer,
)

# ---------------- Filters ----------------
class StockTxnFilter(FilterSet):
    created_at = DateFromToRangeFilter(field_name="created_at")
    txn_type = CharFilter(field_name="txn_type")
    item = CharFilter(field_name="item_id")

    class Meta:
        model = StockTransaction
        fields = ["created_at", "txn_type", "item"]


# ---------------- Category CRUD ----------------
class ItemCategoryListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = ItemCategory
    queryset = ItemCategory.objects.all().order_by("name")
    serializer_class = ItemCategorySerializer
    permission_classes = [IsAuthenticated, ModulePermission]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "is_active"]
    ordering = ["name"]


class ItemCategoryDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = ItemCategory
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer
    permission_classes = [IsAuthenticated, ModulePermission]


# ---------------- Item CRUD ----------------
class ItemListCreateView(TenantMixin, generics.ListCreateAPIView):
    queryset = Item.objects.select_related("category").all().order_by("-id")
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "is_active"]
    search_fields = ["name", "unit", "category__name"]
    ordering_fields = ["id", "name", "current_stock", "reorder_level"]
    ordering = ["-id"]


class ItemDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Item
    queryset = Item.objects.select_related("category").all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, ModulePermission]


# ---------------- Stock Transactions CRUD ----------------
class StockTxnListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = StockTransaction
    queryset = StockTransaction.objects.select_related("item", "item__category").all().order_by("-id")
    serializer_class = StockTransactionSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = StockTxnFilter
    search_fields = ["item__name", "note", "reference_type", "reference_id"]
    ordering_fields = ["id", "created_at", "quantity"]
    ordering = ["-id"]


class StockTxnDetailView(TenantMixin, generics.RetrieveUpdateDestroyAPIView):
    model = StockTransaction
    queryset = StockTransaction.objects.select_related("item", "item__category").all()
    serializer_class = StockTransactionSerializer
    permission_classes = [IsAuthenticated, ModulePermission]


# ---------------- Low stock API ----------------
class LowStockItemsView(TenantMixin, generics.ListAPIView):
    model = Item
    queryset = Item.objects.select_related("category").all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, ModulePermission]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(is_active=True, reorder_level__gt=0, current_stock__lte=F("reorder_level")).order_by("current_stock")


# ---------------- Stock Summary Report API ----------------
# GET /api/inventory/report/?start=YYYY-MM-DD&end=YYYY-MM-DD&item=<id>
@api_view(["GET"])
@permission_classes([IsAuthenticated, ModulePermission])
def stock_report(request):
    tenant = getattr(request, "tenant", None)
    
    start = request.GET.get("start")
    end = request.GET.get("end")
    item_id = request.GET.get("item")
 
    qs = StockTransaction.objects.all()
    if tenant:
        qs = qs.filter(organization=tenant)

    if start:
        try:
            start_dt = datetime.strptime(start, "%Y-%m-%d")
            qs = qs.filter(created_at__date__gte=start_dt.date())
        except ValueError:
            return Response({"error": "Invalid start date. Use YYYY-MM-DD"}, status=400)

    if end:
        try:
            end_dt = datetime.strptime(end, "%Y-%m-%d")
            qs = qs.filter(created_at__date__lte=end_dt.date())
        except ValueError:
            return Response({"error": "Invalid end date. Use YYYY-MM-DD"}, status=400)

    if item_id:
        qs = qs.filter(item_id=item_id)

    from django.db.models import F, Sum, DecimalField, ExpressionWrapper
    
    # Calculate monetary value (qty * price)
    val_qs = qs.annotate(
        total_val=ExpressionWrapper(F('quantity') * F('unit_price'), output_field=DecimalField())
    )

    stock_in_qty = qs.filter(txn_type=StockTransaction.TYPE_IN).aggregate(total=Sum("quantity"))["total"] or 0
    stock_out_qty = qs.filter(txn_type=StockTransaction.TYPE_OUT).aggregate(total=Sum("quantity"))["total"] or 0
    
    stock_in_val = val_qs.filter(txn_type=StockTransaction.TYPE_IN).aggregate(total=Sum("total_val"))["total"] or 0
    stock_out_val = val_qs.filter(txn_type=StockTransaction.TYPE_OUT).aggregate(total=Sum("total_val"))["total"] or 0

    return Response({
        "filters": {"start": start, "end": end, "item": item_id},
        "stock_in_total": str(stock_in_qty),
        "stock_out_total": str(stock_out_qty),
        "stock_in_value": str(stock_in_val),
        "stock_out_value": str(stock_out_val),
        "net_price_change": str(stock_in_val - stock_out_val),
    })
