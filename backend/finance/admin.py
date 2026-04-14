from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("txn_type", "title", "amount", "date", "reference")
    list_filter = ("txn_type", "date")
    search_fields = ("title", "reference")
