from django.urls import path
from .views import DailyPanchangView

urlpatterns = [
    path('daily/', DailyPanchangView.as_view(), name='daily-panchang'),
]
