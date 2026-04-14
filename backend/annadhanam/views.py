from rest_framework import generics
from .models import MealToken, PrasadConsumption
from .serializers import MealTokenSerializer, PrasadConsumptionSerializer

class MealTokenListCreateView(generics.ListCreateAPIView):
    queryset = MealToken.objects.all()
    serializer_class = MealTokenSerializer

class PrasadConsumptionListCreateView(generics.ListCreateAPIView):
    queryset = PrasadConsumption.objects.all()
    serializer_class = PrasadConsumptionSerializer
