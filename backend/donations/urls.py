from django.urls import path
from .views import (
    DonationListCreateView,
    DonationDetailView,
    DonationCategoryListCreateView,
    DonationCategoryDetailView,
    create_donation_order,
    confirm_donation_payment,
    donation_payment_webhook,
    DonationExportCSVView,
    donation_receipt_pdf,
)

app_name = "donations"

urlpatterns = [
    # Donations CRUD
    path("", DonationListCreateView.as_view(), name="donation-list-create"),
    path("<int:pk>/", DonationDetailView.as_view(), name="donation-detail"),

    # Categories CRUD
    path("categories/", DonationCategoryListCreateView.as_view(), name="donation-category-list-create"),
    path("categories/<int:pk>/", DonationCategoryDetailView.as_view(), name="donation-category-detail"),

    # Online payment flow
    path("<int:pk>/create-order/", create_donation_order, name="donation-create-order"),
    path("<int:pk>/confirm-payment/", confirm_donation_payment, name="donation-confirm-payment"),
    path("<int:pk>/receipt-pdf/", donation_receipt_pdf, name="donation-receipt-pdf"),

    # Gateway webhooks
    path("webhook/<str:gateway>/", donation_payment_webhook, name="donation-payment-webhook"),

    # Export reports (admin only)
    path("export/", DonationExportCSVView.as_view(), name="donation-export-csv"),
]
