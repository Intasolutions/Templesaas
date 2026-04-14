from django.contrib import admin
from .models import Tenant, Plan


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
    readonly_fields = ("created_at",)
