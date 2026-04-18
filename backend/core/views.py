from rest_framework import generics, status, parsers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Tenant
from .serializers import TenantSerializer

from .models import Tenant, Plan, SubscriptionRequest
from .serializers import TenantSerializer, PlanSerializer, SubscriptionRequestSerializer
from django.utils import timezone
from rest_framework import serializers

class TenantProfileView(generics.RetrieveUpdateAPIView):
    # ... (existing logic)
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_object(self):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant and self.request.user.is_authenticated:
            profile = getattr(self.request.user, 'profile', None)
            if profile and profile.organization:
                tenant = profile.organization
        if not tenant and self.request.user.is_superuser:
            tenant = Tenant.objects.first()
        return tenant

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class PlanListView(generics.ListAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

class SubscriptionRequestViewSet(generics.ListCreateAPIView):
    serializer_class = SubscriptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return SubscriptionRequest.objects.all().order_by('-requested_at')
        profile = getattr(user, 'profile', None)
        if profile and profile.organization:
            return SubscriptionRequest.objects.filter(tenant=profile.organization).order_by('-requested_at')
        return SubscriptionRequest.objects.none()

    def perform_create(self, serializer):
        profile = getattr(self.request.user, 'profile', None)
        if profile and profile.organization:
            tenant = profile.organization
            tenant.status = Tenant.STATUS_PENDING_APPROVAL
            tenant.save()
            serializer.save(tenant=tenant)
        else:
            raise serializers.ValidationError("User must be associated with a temple to request a plan.")

class SubscriptionApprovalView(generics.UpdateAPIView):
    queryset = SubscriptionRequest.objects.all()
    serializer_class = SubscriptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error": "Only SaaS owners can approve requests."}, status=status.HTTP_403_FORBIDDEN)
        
        obj = self.get_object()
        action = request.data.get("action") 
        admin_notes = request.data.get("admin_notes", "")

        if action == "approve":
            obj.status = SubscriptionRequest.STATUS_APPROVED
            obj.processed_at = timezone.now()
            obj.admin_notes = admin_notes
            obj.save()
            
            tenant = obj.tenant
            tenant.status = Tenant.STATUS_APPROVED
            tenant.save()
            return Response({"status": "Request approved. Tenant can now proceed to payment."})
        
        elif action == "reject":
            obj.status = SubscriptionRequest.STATUS_REJECTED
            obj.processed_at = timezone.now()
            obj.admin_notes = admin_notes
            obj.save()
            
            tenant = obj.tenant
            tenant.status = Tenant.STATUS_TRIAL
            tenant.save()
            return Response({"status": "Request rejected."})
        
        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
