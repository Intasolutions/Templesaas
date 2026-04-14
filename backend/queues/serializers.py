from rest_framework import serializers
from .models import QueueSession, Token

class QueueSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueueSession
        fields = "__all__"
        read_only_fields = ["organization"]

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = "__all__"
        read_only_fields = ["organization", "number"]
