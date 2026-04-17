from django.contrib import admin
from .models import Lead

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('temple_name', 'full_name', 'email', 'phone', 'is_responded', 'created_at')
    list_filter = ('is_responded', 'created_at', 'interested_plan')
    search_fields = ('temple_name', 'full_name', 'email', 'phone')
    readonly_fields = ('created_at',)
