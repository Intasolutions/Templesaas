from rest_framework import serializers
from .models import MealToken, PrasadConsumption

class MealTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealToken
        fields = "__all__"

class PrasadConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrasadConsumption
        fields = "__all__"
