from django.urls import path
from .views import (
    HundiSessionListCreateView,
    HundiSessionDetailView,
    HundiCollectionListCreateView,
)

app_name = "hundi"

urlpatterns = [
    path("sessions/", HundiSessionListCreateView.as_view(), name="session-list-create"),
    path("sessions/<int:pk>/", HundiSessionDetailView.as_view(), name="session-detail"),
    path("collections/", HundiCollectionListCreateView.as_view(), name="collection-list-create"),
]
