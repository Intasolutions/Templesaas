from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    current_occupancy = serializers.ReadOnlyField(source='get_current_occupancy')
    occupancy_percentage = serializers.ReadOnlyField(source='get_occupancy_percentage')

    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ["organization"]
