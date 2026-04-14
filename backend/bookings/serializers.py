from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    # Devotee details (for UI + print)
    devotee_name = serializers.CharField(source="devotee.full_name", read_only=True)
    devotee_phone = serializers.CharField(source="devotee.phone", read_only=True)
    devotee_gothra = serializers.CharField(source="devotee.gothra.name", read_only=True)
    devotee_nakshatra = serializers.CharField(source="devotee.nakshatra.name", read_only=True)

    # Pooja details
    pooja_name = serializers.CharField(source="pooja.name", read_only=True)

    # Slot details (if used)
    slot_time = serializers.TimeField(source="slot.start_time", read_only=True)
    priest_name = serializers.CharField(source="slot.priest.username", read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = [
            "created_at",
            "gateway_order_id",
            "gateway_payment_id",
            "gateway",
            "receipt_no",
            "qr_payload",
            "qr_image",
        ]

    def validate(self, attrs):
        # On update, fall back to existing values
        devotee = attrs.get("devotee", getattr(self.instance, "devotee", None))
        pooja = attrs.get("pooja", getattr(self.instance, "pooja", None))
        slot = attrs.get("slot", getattr(self.instance, "slot", None))
        booking_date = attrs.get("booking_date", getattr(self.instance, "booking_date", None))

        source = attrs.get("source", getattr(self.instance, "source", Booking.SOURCE_OFFLINE))
        payment_mode = attrs.get("payment_mode", getattr(self.instance, "payment_mode", ""))

        # Slot must belong to the same pooja
        if slot and pooja and getattr(slot, "pooja_id", None) != pooja.id:
            raise serializers.ValidationError({"slot": "Selected slot does not belong to the selected pooja."})

        # ---------- Online booking rules ----------
        if source == Booking.SOURCE_ONLINE:
            if payment_mode == Booking.PAYMENT_CASH:
                raise serializers.ValidationError({"payment_mode": "Cash is not allowed for online bookings."})
            if payment_mode and payment_mode not in {Booking.PAYMENT_UPI, Booking.PAYMENT_CARD, Booking.PAYMENT_WALLET}:
                raise serializers.ValidationError({"payment_mode": "Invalid payment mode for online booking."})

        # ---------- Capacity check (prevents overbooking) ----------
        # Only enforce when slot + booking_date are present and slot has capacity set
        if slot and booking_date and slot.capacity:
            qs = Booking.objects.filter(
                slot=slot,
                booking_date=booking_date,
            ).exclude(status__in=[Booking.STATUS_CANCELLED, Booking.STATUS_REFUNDED])

            # If updating existing booking, exclude itself
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)

            booked_count = qs.count()
            if booked_count >= slot.capacity:
                raise serializers.ValidationError({"slot": "This time slot is fully booked."})

        return attrs
