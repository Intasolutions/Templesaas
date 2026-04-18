from rest_framework import serializers
from .models import Tenant, Plan, SubscriptionRequest

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'allowed_apps', 'amount_inr']

class TenantSerializer(serializers.ModelSerializer):
    plan_name = serializers.SerializerMethodField()
    allowed_apps = serializers.SerializerMethodField()

    def get_plan_name(self, obj):
        return obj.plan.name if obj.plan else "N/A"

    def get_allowed_apps(self, obj):
        return obj.plan.allowed_apps if obj.plan else []

    class Meta:
        model = Tenant
        fields = [
            'id', 'name', 'subdomain', 'logo', 'brand_color',
            'contact_email', 'contact_phone', 'address',
            'latitude', 'longitude', 'plan', 'plan_name', 'allowed_apps', 
            'authorized_signatory_name', 'authorized_signatory_designation',
            'is_active', 'is_trial', 'trial_ends_at', 'status'
        ]
        read_only_fields = ['subdomain', 'plan', 'allowed_apps', 'is_active', 'status']

class SubscriptionRequestSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)
    plan_name = serializers.CharField(source="plan.name", read_only=True)

    class Meta:
        model = SubscriptionRequest
        fields = [
            'id', 'tenant', 'tenant_name', 'plan', 'plan_name', 
            'status', 'billing_cycle', 'amount', 'notes', 
            'admin_notes', 'requested_at', 'processed_at'
        ]
        read_only_fields = ['status', 'processed_at']
