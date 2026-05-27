from django.contrib import admin
from .models import Tenant, Plan, Subscription, SubscriptionRequest


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("name", "allowed_apps")
    search_fields = ("name",)


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ("name", "subdomain", "db_name", "plan", "created_at")
    search_fields = ("name", "subdomain", "db_name")
    list_filter = ("plan",)
    list_select_related = ("plan",)
    list_select_related = ("plan",)
    readonly_fields = ("created_at",)

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'razorpay_subscription_id', 'status', 'current_period_end')
    list_filter = ('status',)
    search_fields = ('tenant__name', 'razorpay_subscription_id')

@admin.register(SubscriptionRequest)
class SubscriptionRequestAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'plan', 'status', 'requested_at')
    list_filter = ('status', 'plan')
