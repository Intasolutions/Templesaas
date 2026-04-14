from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrasadShipmentViewSet

router = DefaultRouter()
router.register(r'shipments', PrasadShipmentViewSet, basename='shipment')

urlpatterns = [
    path('', include(router.urls)),
]
