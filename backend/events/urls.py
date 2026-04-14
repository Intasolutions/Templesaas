from django.urls import path
from .views import (
    EventListCreateView,
    EventDetailView,
    event_pass_pdf,
    event_sample_pass_pdf,
)

app_name = "events"

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("<int:pk>/", EventDetailView.as_view(), name="event-detail"),
    path("<int:event_id>/pass/<int:booking_id>/", event_pass_pdf, name="event-pass-pdf"),
    path("<int:event_id>/pass/sample/", event_sample_pass_pdf, name="event-sample-pass-pdf"),
]
