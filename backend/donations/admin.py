from django.contrib import admin
from .models import Donation, DonationCategory

@admin.register(DonationCategory)
class DonationCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    ordering = ("name",)

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = (
        "receipt_no",
        "devotee",
        "category",
        "amount",
        "payment_mode",
        "payment_status",
        "donated_at",
    )
    list_filter = ("payment_mode", "payment_status", "is_gst_applicable", "category")
    search_fields = (
        "receipt_no",
        "devotee__full_name",
        "devotee__phone",
        "display_name",
        "gateway_order_id",
        "gateway_payment_id",
    )
    ordering = ("-donated_at",)
    list_select_related = ("devotee", "category")
    readonly_fields = ("donated_at",)
