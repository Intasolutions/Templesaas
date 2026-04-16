from django.urls import path
from .views import TenantProfileView
from .billing_views import (
    PlanListView, CreateOrderView, VerifyPaymentView,
    CreateSubscriptionView, VerifySubscriptionView, RazorpayWebhookView
)

urlpatterns = [
    path('profile/', TenantProfileView.as_view(), name='tenant-profile'),

    # ── Billing ───────────────────────────────────────────────────────────
    path('billing/plans/', PlanListView.as_view(), name='billing-plans'),
    path('billing/create-order/', CreateOrderView.as_view(), name='billing-create-order'),
    path('billing/verify/', VerifyPaymentView.as_view(), name='billing-verify'),

    # Phase 4: Subscriptions
    path('billing/create-subscription/', CreateSubscriptionView.as_view(), name='billing-create-subscription'),
    path('billing/verify-subscription/', VerifySubscriptionView.as_view(), name='billing-verify-subscription'),
    path('billing/webhook/', RazorpayWebhookView.as_view(), name='billing-webhook'),
]
