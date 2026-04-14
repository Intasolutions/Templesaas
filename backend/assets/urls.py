from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssetViewSet, AssetCategoryViewSet, MaintenanceLogViewSet

router = DefaultRouter()
router.register(r'registry', AssetViewSet)
router.register(r'categories', AssetCategoryViewSet)
router.register(r'maintenance', MaintenanceLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
