from django.urls import path
from .views import (
    PoojaListCreateView,
    PoojaDetailView,
    PoojaTimeSlotListCreateView,
    PoojaTimeSlotDetailView,
    daily_print,
)

app_name = "pooja"

urlpatterns = [
    # Pooja CRUD
    path("", PoojaListCreateView.as_view(), name="pooja-list-create"),
    path("<int:pk>/", PoojaDetailView.as_view(), name="pooja-detail"),

    # Time slots CRUD
    path("slots/", PoojaTimeSlotListCreateView.as_view(), name="pooja-slot-list-create"),
    path("slots/<int:pk>/", PoojaTimeSlotDetailView.as_view(), name="pooja-slot-detail"),

    # Daily print
    path("daily-print/", daily_print, name="pooja-daily-print"),
]
