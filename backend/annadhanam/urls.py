from django.urls import path
from .views import (
    MealTokenListCreateView,
    PrasadConsumptionListCreateView,
)

app_name = "annadhanam"

urlpatterns = [
    path("meal-tokens/", MealTokenListCreateView.as_view(), name="meal-token-list-create"),
    path("prasad-consumption/", PrasadConsumptionListCreateView.as_view(), name="prasad-consumption-list-create"),
]
