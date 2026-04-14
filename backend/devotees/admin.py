from django.contrib import admin
from .models import Devotee, Gothra, Nakshatra

@admin.register(Gothra)
class GothraAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)

@admin.register(Nakshatra)
class NakshatraAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)

@admin.register(Devotee)
class DevoteeAdmin(admin.ModelAdmin):
    list_display = ("full_name", "phone", "email", "gothra", "nakshatra", "created_at")
    search_fields = ("full_name", "phone", "email", "id_proof_number")
    list_filter = ("gothra", "nakshatra", "id_proof_type")
    ordering = ("-created_at",)
    list_select_related = ("gothra", "nakshatra")
