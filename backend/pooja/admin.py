from django.contrib import admin
from .models import Pooja, PoojaTimeSlot


class PoojaTimeSlotInline(admin.TabularInline):
    model = PoojaTimeSlot
    extra = 1
    fields = ("start_time", "end_time", "capacity", "priest", "is_active")
    autocomplete_fields = ("priest",)


@admin.register(Pooja)
class PoojaAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "amount",
        "duration_minutes",
        "is_active",
        "is_festival_special",
        "festival_event",
    )
    search_fields = ("name",)
    list_filter = ("is_active", "is_festival_special", "festival_event")
    ordering = ("name",)
    list_select_related = ("festival_event",)
    inlines = [PoojaTimeSlotInline]


@admin.register(PoojaTimeSlot)
class PoojaTimeSlotAdmin(admin.ModelAdmin):
    list_display = ("pooja", "start_time", "end_time", "capacity", "priest", "is_active")
    list_filter = ("is_active", "pooja")
    search_fields = ("pooja__name", "priest__username")
    autocomplete_fields = ("pooja", "priest")
    ordering = ("pooja", "start_time")
    list_select_related = ("pooja", "priest")
