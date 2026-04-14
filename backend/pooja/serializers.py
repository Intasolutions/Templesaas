from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Pooja, PoojaTimeSlot


class PoojaTimeSlotSerializer(serializers.ModelSerializer):
    priest_name = serializers.CharField(source="priest.username", read_only=True)

    class Meta:
        model = PoojaTimeSlot
        fields = "__all__"
        read_only_fields = ["organization"]

    def validate(self, attrs):
        """
        - Ensure end_time > start_time if provided
        """
        start_time = attrs.get("start_time", getattr(self.instance, "start_time", None))
        end_time = attrs.get("end_time", getattr(self.instance, "end_time", None))

        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError({"end_time": "End time must be after start time."})

        return attrs


class PoojaSerializer(serializers.ModelSerializer):
    # show all slots inside pooja (read-only list)
    time_slots = PoojaTimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Pooja
        fields = "__all__"
        read_only_fields = ["created_at", "organization"]

    def validate(self, attrs):
        """
        Festival special pooja should have festival_event.
        """
        is_festival_special = attrs.get("is_festival_special", getattr(self.instance, "is_festival_special", False))
        festival_event = attrs.get("festival_event", getattr(self.instance, "festival_event", None))

        if is_festival_special and not festival_event:
            raise serializers.ValidationError({"festival_event": "Festival event is required for festival special pooja."})

        return attrs
