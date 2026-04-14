from django.urls import path
from .views import (
    QueueSessionListCreateView,
    QueueSessionDetailView,
    TokenListCreateView,
    tv_display_api,
    call_next_api,
)

app_name = "queues"

urlpatterns = [
    path("sessions/", QueueSessionListCreateView.as_view(), name="session-list-create"),
    path("sessions/<int:pk>/", QueueSessionDetailView.as_view(), name="session-detail"),
    path("tokens/", TokenListCreateView.as_view(), name="token-list-create"),
    path("sessions/<int:pk>/call-next/", call_next_api, name="session-call-next"),
    path("tv-display/", tv_display_api, name="tv-display"),
]
