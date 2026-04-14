from rest_framework import serializers
from .models import PrasadShipment

class PrasadShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrasadShipment
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']
        extra_kwargs = {
            'booking': {'required': False, 'allow_null': True}
        }
