from django.contrib import admin
from .models import Item, ItemCategory, StockTransaction

@admin.register(ItemCategory)
class ItemCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    ordering = ("name",)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "unit",
        "current_stock",
        "reorder_level",
        "is_low_stock",
        "is_active",
    )
    list_filter = ("category", "is_active")
    search_fields = ("name", "category__name")
    ordering = ("name",)
    list_select_related = ("category",)
    readonly_fields = ("current_stock", "created_at")

@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "item",
        "txn_type",
        "quantity",
        "reference_type",
        "reference_id",
        "created_at",
    )
    list_filter = ("txn_type", "created_at")
    search_fields = ("item__name", "reference_type", "reference_id")
    ordering = ("-created_at",)
    list_select_related = ("item",)
    readonly_fields = ("created_at",)
