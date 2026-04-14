from django.urls import path
from .views import (
    # Categories
    ItemCategoryListCreateView,
    ItemCategoryDetailView,

    # Items
    ItemListCreateView,
    ItemDetailView,

    # Stock transactions
    StockTxnListCreateView,
    StockTxnDetailView,

    # Extra APIs
    LowStockItemsView,
    stock_report,
)

app_name = "inventory"

urlpatterns = [
    # Categories
    path("categories/", ItemCategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", ItemCategoryDetailView.as_view(), name="category-detail"),

    # Items
    path("items/", ItemListCreateView.as_view(), name="item-list-create"),
    path("items/<int:pk>/", ItemDetailView.as_view(), name="item-detail"),

    # Transactions
    path("transactions/", StockTxnListCreateView.as_view(), name="txn-list-create"),
    path("transactions/<int:pk>/", StockTxnDetailView.as_view(), name="txn-detail"),

    # Low stock alert
    path("low-stock/", LowStockItemsView.as_view(), name="low-stock-items"),

    # Stock summary report
    path("report/", stock_report, name="stock-report"),
]
