from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    # Devotee details (for UI + print) - Bulletproof
    devotee_name = serializers.SerializerMethodField()
    devotee_phone = serializers.SerializerMethodField()
    devotee_gothra = serializers.SerializerMethodField()
    devotee_nakshatra = serializers.SerializerMethodField()

    def get_devotee_name(self, obj):
        return obj.devotee.full_name if obj.devotee else "Anonymous"

    def get_devotee_phone(self, obj):
        return obj.devotee.phone if obj.devotee else ""

    def get_devotee_gothra(self, obj):
        if obj.devotee and obj.devotee.gothra:
            return obj.devotee.gothra.name
        return ""

    def get_devotee_nakshatra(self, obj):
        if obj.devotee and obj.devotee.nakshatra:
            return obj.devotee.nakshatra.name
        return ""

    # Pooja details - Bulletproof
    pooja_name = serializers.SerializerMethodField()
    prasadam_item_name = serializers.SerializerMethodField()

    def get_pooja_name(self, obj):
        return obj.pooja.name if obj.pooja else None

    def get_prasadam_item_name(self, obj):
        return obj.prasadam_item.name if obj.prasadam_item else None

    # Slot details (if used) - Bulletproof
    slot_time = serializers.SerializerMethodField()
    priest_name = serializers.SerializerMethodField()

    def get_slot_time(self, obj):
        if obj.slot and obj.slot.start_time:
            return obj.slot.start_time.strftime("%H:%M")
        return None

    def get_priest_name(self, obj):
        if obj.slot and obj.slot.priest:
            return obj.slot.priest.username
        return None

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
    def create(self, validated_data):
        shipping_details = self.initial_data.get("shipping_details")
        booking = super().create(validated_data)
        
        if shipping_details:
            try:
                from shipments.models import PrasadShipment
                PrasadShipment.objects.create(
                    organization=booking.organization,
                    booking=booking,
                    recipient_name=shipping_details.get("recipient_name"),
                    shipping_address=shipping_details.get("shipping_address"),
                    contact_number=shipping_details.get("contact_number")
                )
            except Exception as e:
                # Log error but don't fail booking
                print(f"Failed to create shipment: {e}")
                
        return booking
