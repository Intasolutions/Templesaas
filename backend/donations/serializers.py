from rest_framework import serializers
from .models import Donation, DonationCategory


class DonationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationCategory
        fields = ["id", "name", "is_active"]


class DonationSerializer(serializers.ModelSerializer):
    # Devotee details
    devotee_name = serializers.CharField(source="devotee.full_name", read_only=True)
    devotee_phone = serializers.CharField(source="devotee.phone", read_only=True)

    # Category display
    category_name = serializers.CharField(source="category.name", read_only=True)

    # Donor name shown to UI (recognition requirement)
    donor_display_name = serializers.SerializerMethodField()

    def get_donor_display_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return obj.display_name or obj.devotee.full_name

    class Meta:
        model = Donation
        fields = "__all__"
        read_only_fields = [
            "donated_at",
            "receipt_no",
            "qr_payload",
            "qr_image",
            "gateway",
            "gateway_order_id",
            "gateway_payment_id",
        ]

    def validate(self, attrs):
        # fallback to instance values on update
        devotee = attrs.get("devotee", getattr(self.instance, "devotee", None))
        category = attrs.get("category", getattr(self.instance, "category", None))

        # GST validation
        is_gst = attrs.get("is_gst_applicable", getattr(self.instance, "is_gst_applicable", False))
        gst_number = attrs.get("gst_number", getattr(self.instance, "gst_number", ""))

        if is_gst and not gst_number:
            raise serializers.ValidationError({"gst_number": "GST number is required when GST is applicable."})

        return attrs
