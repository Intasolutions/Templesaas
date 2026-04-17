from rest_framework import serializers
from .models import PrasadShipment, PrasadamItem
from bookings.serializers import BookingSerializer

class PrasadShipmentSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source='booking', read_only=True)
    
    class Meta:
        model = PrasadShipment
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']
        extra_kwargs = {
            'booking': {'required': False, 'allow_null': True}
        }

class PrasadamItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrasadamItem
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']
