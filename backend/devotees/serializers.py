import re
from rest_framework import serializers
from .models import Devotee, Gothra, Nakshatra

from bookings.models import Booking
from donations.models import Donation


class GothraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gothra
        fields = ["id", "name", "organization"]
        read_only_fields = ["organization"]


class NakshatraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nakshatra
        fields = ["id", "name", "organization"]
        read_only_fields = ["organization"]


class DevoteeSerializer(serializers.ModelSerializer):
    gothra_name = serializers.CharField(source="gothra.name", read_only=True)
    nakshatra_name = serializers.CharField(source="nakshatra.name", read_only=True)

    class Meta:
        model = Devotee
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "organization"]

    # ---------- Validations (client asked validations in add/edit form) ----------

    def validate_phone(self, value: str) -> str:
        """
        Basic India-friendly phone validation (10-15 digits).
        Adjust as per your country rules.
        """
        phone = re.sub(r"\s+", "", value or "")
        if not re.fullmatch(r"^\+?\d{10,15}$", phone):
            raise serializers.ValidationError("Enter a valid phone number (10-15 digits).")
        return phone

    def validate_email(self, value: str) -> str:
        return (value or "").strip().lower()

    def validate(self, attrs):
        """
        - Validate ID proof patterns based on type (basic)
        """
        id_type = attrs.get("id_proof_type", getattr(self.instance, "id_proof_type", "")) or ""
        id_number = (attrs.get("id_proof_number", getattr(self.instance, "id_proof_number", "")) or "").strip()

        if id_type and id_number:
            if id_type == Devotee.ID_PAN:
                # PAN format: AAAAA9999A
                if not re.fullmatch(r"^[A-Z]{5}\d{4}[A-Z]{1}$", id_number.upper()):
                    raise serializers.ValidationError({"id_proof_number": "Invalid PAN format."})
                attrs["id_proof_number"] = id_number.upper()

            elif id_type == Devotee.ID_AADHAR:
                # Aadhar: 12 digits (basic)
                if not re.fullmatch(r"^\d{12}$", re.sub(r"\s+", "", id_number)):
                    raise serializers.ValidationError({"id_proof_number": "Invalid Aadhar number (12 digits)."})
                attrs["id_proof_number"] = re.sub(r"\s+", "", id_number)

        return attrs


# ---- Full details with history ----
class BookingMiniSerializer(serializers.ModelSerializer):
    pooja_name = serializers.CharField(source="pooja.name", read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "booking_date", "booking_time", "status", "amount", "pooja", "pooja_name"]


class DonationMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ["id", "receipt_no", "amount", "payment_mode", "purpose", "donated_at"]


class DevoteeFullSerializer(DevoteeSerializer):
    """
    Using method fields so this works even if Booking/Donation related_name
    is not exactly 'bookings'/'donations'.
    """
    bookings = serializers.SerializerMethodField()
    donations = serializers.SerializerMethodField()

    class Meta(DevoteeSerializer.Meta):
        fields = "__all__"

    def get_bookings(self, obj):
        # preferred: related_name="bookings"
        qs = getattr(obj, "bookings", None)
        if qs is None:
            qs = getattr(obj, "booking_set", None)
        if qs is None:
            return []
        return BookingMiniSerializer(qs.all().order_by("-booking_date"), many=True).data

    def get_donations(self, obj):
        qs = getattr(obj, "donations", None)
        if qs is None:
            qs = getattr(obj, "donation_set", None)
        if qs is None:
            return []
        return DonationMiniSerializer(qs.all().order_by("-donated_at"), many=True).data
