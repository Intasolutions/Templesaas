from rest_framework import serializers, generics
from rest_framework.permissions import AllowAny
from .models import Lead

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = "__all__"
        extra_kwargs = {
            'location': {'required': False},
            'message': {'required': False},
            'trial_requested': {'required': False},
            'latitude': {'required': False},
            'longitude': {'required': False},
        }

class LeadCreateView(generics.CreateAPIView):
    """
    POST /api/leads/
    Public access to allow 'Book Demo' from landing page.
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [AllowAny]
