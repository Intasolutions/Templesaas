from django.contrib import admin
from .models import HundiSession, HundiCollection, HundiWitness

class CollectionInline(admin.TabularInline):
    model = HundiCollection
    extra = 1

class WitnessInline(admin.TabularInline):
    model = HundiWitness
    extra = 1

@admin.register(HundiSession)
class HundiSessionAdmin(admin.ModelAdmin):
    list_display = ('name', 'opening_date', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'opening_date')
    search_fields = ('name',)
    inlines = [CollectionInline, WitnessInline]
    readonly_fields = ('total_amount', 'created_at')

@admin.register(HundiCollection)
class HundiCollectionAdmin(admin.ModelAdmin):
    list_display = ('session', 'denomination', 'count', 'amount')
    list_filter = ('denomination',)

@admin.register(HundiWitness)
class HundiWitnessAdmin(admin.ModelAdmin):
    list_display = ('name', 'session', 'role')
