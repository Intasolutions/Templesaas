from django.urls import path
from .views import DailyPanchangView, NakshatraDatesView, RangePanchangView

urlpatterns = [
    path('', DailyPanchangView.as_view(), name='panchang-base'),
    path('daily/', DailyPanchangView.as_view(), name='daily-panchang'),
    path('range/', RangePanchangView.as_view(), name='range-panchang'),
    path('nakshatra-dates/', NakshatraDatesView.as_view(), name='nakshatra-dates'),
]
