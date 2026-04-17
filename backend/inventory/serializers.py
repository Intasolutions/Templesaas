from rest_framework import serializers
from .models import Item, ItemCategory, StockTransaction


# ----------------------------
# Item Category
# ----------------------------
class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ["id", "name", "is_active", "organization"]
        read_only_fields = ["organization"]


class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Item
        fields = "__all__"
        read_only_fields = [
            "created_at",
            "organization",
        ]


class StockTransactionSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)
    item_unit = serializers.CharField(source="item.unit", read_only=True)
    item_category = serializers.CharField(source="item.category.name", read_only=True)

    class Meta:
        model = StockTransaction
        fields = ["id", "item", "item_name", "item_unit", "item_category", "txn_type", "quantity", "unit_price", "note", "created_at"]
        read_only_fields = [
            "created_at",
            "organization",
        ]

    def validate(self, attrs):
        item = attrs.get("item")
        qty = attrs.get("quantity")
        txn_type = attrs.get("txn_type")

        if qty is None or qty <= 0:
            raise serializers.ValidationError({"quantity": "Quantity must be greater than zero."})

        # Prevent negative stock (extra API-level guard)
        if txn_type == StockTransaction.TYPE_OUT and item:
            if item.current_stock - qty < 0:
                raise serializers.ValidationError({"quantity": "Insufficient stock."})

        return attrs
