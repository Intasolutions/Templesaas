from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "devotee",
        "pooja",
        "booking_date",
        "amount",
        "status",
        "payment_status",
        "source",
        "created_at",
    )
    list_filter = ("status", "payment_status", "source", "booking_date")
    search_fields = (
        "devotee__full_name",
        "devotee__phone",
        "pooja__name",
        "receipt_no",
        "gateway_order_id",
        "gateway_payment_id",
    )
    ordering = ("-created_at",)
    list_select_related = ("devotee", "pooja", "slot")
    readonly_fields = ("created_at",)
