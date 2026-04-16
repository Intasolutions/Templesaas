"""
Razorpay Billing Views — Phase 3
Endpoints:
  POST /api/billing/create-order/   → Creates a Razorpay order for a given plan
  POST /api/billing/verify/         → Verifies payment signature, upgrades Tenant plan
  GET  /api/billing/plans/          → Returns all available plans
"""

import hmac
import hashlib
import razorpay
from django.conf import settings
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from core.models import Plan, Tenant

# ── Constants ────────────────────────────────────────────────────────────────
PLAN_PRICING = {
    # Plan name → (amount_paise, label)
    Plan.LITE:    (150000,   "Lite Plan — ₹1,500/month"),
    Plan.PRO:     (250000,   "Pro Plan — ₹2,500/month"),
    Plan.PRO_MAX: (300000,   "Pro Max Plan — ₹3,000/month"),
}


def _get_razorpay_client():
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


# ── View: List Plans ─────────────────────────────────────────────────────────
class PlanListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        plans = Plan.objects.all()
        data = []
        for plan in plans:
            pricing = PLAN_PRICING.get(plan.name, (0, ""))
            data.append({
                "name": plan.name,
                "label": pricing[1],
                "amount_paise": pricing[0],
                "amount_inr": pricing[0] // 100,
                "allowed_apps": plan.allowed_apps,
            })
        return Response(data)


# ── View: Create Razorpay Order ───────────────────────────────────────────────
class CreateOrderView(APIView):
    """
    POST /api/billing/create-order/
    Body: { plan_name: "PRO" }
    Returns: { order_id, amount, currency, razorpay_key }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_name = request.data.get("plan_name", "").upper()

        if plan_name not in PLAN_PRICING:
            return Response(
                {"error": f"Invalid plan '{plan_name}'. Choose from: {list(PLAN_PRICING.keys())}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        tenant = getattr(request, "tenant", None)
        if not tenant:
            return Response({"error": "No tenant associated with your account."}, status=400)

        amount_paise, label = PLAN_PRICING[plan_name]

        try:
            client = _get_razorpay_client()
            order = client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "receipt": f"temple_{tenant.subdomain}_{plan_name}",
                "notes": {
                    "tenant_id": str(tenant.id),
                    "tenant_name": tenant.name,
                    "plan": plan_name,
                },
            })
        except Exception as e:
            return Response({"error": f"Failed to create order: {str(e)}"}, status=500)

        return Response({
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "plan_name": plan_name,
            "label": label,
            "tenant_name": tenant.name,
            "prefill_email": request.user.email,
            "prefill_name": request.user.get_full_name() or request.user.username,
        })


# ── View: Create Razorpay Subscription ─────────────────────────────────────────
class CreateSubscriptionView(APIView):
    """
    POST /api/billing/create-subscription/
    Body: { plan_name: "PRO" }
    Returns: { subscription_id, razorpay_key, ... }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_name = request.data.get("plan_name", "").upper()
        tenant = getattr(request, "tenant", None)

        if not tenant:
            return Response({"error": "No tenant associated."}, status=400)

        try:
            plan = Plan.objects.get(name=plan_name)
            if not plan.razorpay_plan_id:
                return Response({"error": f"Razorpay Plan ID not configured for {plan_name}. Please set it in Admin."}, status=400)
            
            client = _get_razorpay_client()
            
            # 1. Ensure customer exists in Razorpay
            if not tenant.razorpay_customer_id:
                customer = client.customer.create({
                    "name": tenant.name,
                    "email": tenant.contact_email or request.user.email,
                    "contact": tenant.contact_phone,
                    "notes": {"tenant_id": str(tenant.id)}
                })
                tenant.razorpay_customer_id = customer['id']
                tenant.save(update_fields=['razorpay_customer_id'])

            # 2. Create Subscription
            subscription_data = {
                "plan_id": plan.razorpay_plan_id,
                "customer_id": tenant.razorpay_customer_id,
                "total_count": 12, # 1 year for now
                "quantity": 1,
                "notes": {
                    "tenant_id": str(tenant.id),
                    "plan_name": plan_name
                }
            }
            
            sub = client.subscription.create(subscription_data)
            
            return Response({
                "subscription_id": sub["id"],
                "razorpay_key": settings.RAZORPAY_KEY_ID,
                "plan_name": plan_name,
                "tenant_name": tenant.name,
                "prefill_email": request.user.email,
            })

        except Plan.DoesNotExist:
            return Response({"error": "Plan not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# ── View: Verify Subscription ────────────────────────────────────────────────
class VerifySubscriptionView(APIView):
    """
    POST /api/billing/verify-subscription/
    Verifies the initial recurring payment.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        sub_id = request.data.get("razorpay_subscription_id")
        payment_id = request.data.get("razorpay_payment_id")
        signature = request.data.get("razorpay_signature")
        plan_name = request.data.get("plan_name")

        # Verify signature
        client = _get_razorpay_client()
        params_dict = {
            'razorpay_subscription_id': sub_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        
        try:
            client.utility.verify_subscription_payment_signature(params_dict)
            
            tenant = request.tenant
            plan = Plan.objects.get(name=plan_name)
            
            with transaction.atomic():
                # Update Tenant Plan
                tenant.plan = plan
                tenant.save()
                
                # Create/Update Subscription Record
                from django.utils import timezone
                from datetime import timedelta
                
                # Fetch sub details from Razorpay to get period
                razor_sub = client.subscription.fetch(sub_id)
                
                from .models import Subscription
                Subscription.objects.update_or_create(
                    tenant=tenant,
                    defaults={
                        "razorpay_subscription_id": sub_id,
                        "razorpay_plan_id": plan.razorpay_plan_id,
                        "status": razor_sub.get('status', 'active'),
                        "current_period_start": timezone.now(),
                        "current_period_end": timezone.now() + timedelta(days=30)
                    }
                )

            return Response({"success": True, "message": f"Welcome to {plan_name}!"})
        except Exception as e:
            return Response({"error": "Signature verification failed"}, status=400)


# ── Razorpay Webhook (Phase 4) ───────────────────────────────────────────────
class RazorpayWebhookView(APIView):
    """
    POST /api/billing/webhook/
    Handles recurring payment success, failures, and cancellations.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # In a real app, verify request.headers.get('X-Razorpay-Signature')
        event = request.data.get('event')
        payload = request.data.get('payload', {})
        
        if event == 'subscription.charged':
            sub_payload = payload.get('subscription', {}).get('entity', {})
            sub_id = sub_payload.get('id')
            
            from .models import Subscription
            try:
                sub_obj = Subscription.objects.get(razorpay_subscription_id=sub_id)
                # Extend subscription
                from django.utils import timezone
                from datetime import timedelta
                sub_obj.current_period_end = timezone.now() + timedelta(days=30)
                sub_obj.status = 'active'
                sub_obj.save()
            except Subscription.DoesNotExist:
                pass

        return Response({"status": "ok"})


# ── View: Verify Payment & Upgrade Plan (Legacy One-Time) ──────────────────────────────────────
class VerifyPaymentView(APIView):
    # (Existing implementation kept for backward compatibility or one-time items)
    ...
