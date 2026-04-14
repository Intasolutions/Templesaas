from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailView,
    create_order,
    confirm_payment,
    refund_booking,
    payment_webhook,
    booking_receipt_pdf,
)

app_name = "bookings"

urlpatterns = [
    # CRUD
    path("", BookingListCreateView.as_view(), name="booking-list-create"),
    path("<int:pk>/", BookingDetailView.as_view(), name="booking-detail"),
    path("<int:pk>/pdf/", booking_receipt_pdf, name="booking-receipt-pdf"),

    # Online booking actions
    path("<int:pk>/create-order/", create_order, name="booking-create-order"),
    path("<int:pk>/confirm-payment/", confirm_payment, name="booking-confirm-payment"),

    # Refund
    path("<int:pk>/refund/", refund_booking, name="booking-refund"),

    # Gateway webhooks
    path("webhook/<str:gateway>/", payment_webhook, name="booking-payment-webhook"),
]
