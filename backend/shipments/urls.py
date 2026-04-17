from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrasadShipmentViewSet, PrasadamItemViewSet

router = DefaultRouter()
router.register(r'shipments', PrasadShipmentViewSet, basename='shipment')
router.register(r'prasadam-items', PrasadamItemViewSet, basename='prasadam-item')

urlpatterns = [
    path('', include(router.urls)),
]
