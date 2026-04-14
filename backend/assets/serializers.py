from rest_framework import serializers
from .models import Asset, AssetCategory, MaintenanceLog

class AssetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetCategory
        fields = "__all__"

class MaintenanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceLog
        fields = "__all__"

class AssetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    is_overdue = serializers.BooleanField(source="is_maintenance_overdue", read_only=True)
    next_due = serializers.DateField(source="next_maintenance_due", read_only=True)

    class Meta:
        model = Asset
        fields = [
            "id", "name", "asset_id", "category", "category_name", "description",
            "valuation", "status", "location", "custodian", "is_overdue", "next_due",
            "last_maintained_on", "maintenance_interval_days"
        ]
