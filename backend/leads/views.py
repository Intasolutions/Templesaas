from rest_framework import serializers, generics
from rest_framework.permissions import AllowAny
from .models import Lead

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ["id", "full_name", "temple_name", "phone", "email", "location", "message", "interested_plan", "trial_requested", "latitude", "longitude", "created_at"]

class LeadCreateView(generics.CreateAPIView):
    """
    POST /api/leads/
    Public access to allow 'Book Demo' from landing page.
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [AllowAny]
