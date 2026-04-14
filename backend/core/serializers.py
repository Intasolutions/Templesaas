from rest_framework import serializers
from .models import Tenant, Plan

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['name', 'allowed_apps']

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
            'latitude', 'longitude', 'plan', 'plan_name', 'allowed_apps', 'is_active'
        ]
        read_only_fields = ['subdomain', 'plan', 'allowed_apps', 'is_active']
