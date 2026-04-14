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
    Plan.LITE:    (99900,   "Lite Plan — ₹999/month"),
    Plan.PRO:     (499900,  "Pro Plan — ₹4,999/month"),
    Plan.PRO_MAX: (999900,  "Pro Max Plan — ₹9,999/month"),
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


# ── View: Verify Payment & Upgrade Plan ──────────────────────────────────────
class VerifyPaymentView(APIView):
    """
    POST /api/billing/verify/
    Body: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_name
    }
    Verifies HMAC signature, then upgrades the tenant's plan.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id   = request.data.get("razorpay_order_id", "")
        payment_id = request.data.get("razorpay_payment_id", "")
        signature  = request.data.get("razorpay_signature", "")
        plan_name  = request.data.get("plan_name", "").upper()

        if not all([order_id, payment_id, signature, plan_name]):
            return Response({"error": "Missing payment details."}, status=400)

        # ── Signature verification ────────────────────────────────────────
        expected_sig = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(expected_sig, signature):
            return Response(
                {"error": "Payment signature verification failed. Possible fraud attempt."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ── Upgrade plan ─────────────────────────────────────────────────
        tenant = getattr(request, "tenant", None)
        if not tenant:
            return Response({"error": "No tenant associated."}, status=400)

        try:
            with transaction.atomic():
                new_plan = Plan.objects.get(name=plan_name)
                tenant.plan = new_plan
                tenant.save(update_fields=["plan"])
        except Plan.DoesNotExist:
            return Response({"error": f"Plan '{plan_name}' not found."}, status=400)
        except Exception as e:
            return Response({"error": f"Plan upgrade failed: {str(e)}"}, status=500)

        return Response({
            "success": True,
            "message": f"🎉 Successfully upgraded to {plan_name}! Your new features are now active.",
            "new_plan": plan_name,
            "allowed_apps": tenant.plan.allowed_apps,
        })
