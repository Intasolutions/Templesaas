from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),

    # Health
    path("api/health/", health),

    # API routes
    path("api/users/", include("users.urls")),
    path("api/devotees/", include("devotees.urls")),
    path("api/pooja/", include("pooja.urls")),
    path("api/bookings/", include("bookings.urls")),
    path("api/donations/", include("donations.urls")),
    path("api/events/", include("events.urls")),
    path("api/inventory/", include("inventory.urls")),
    path("api/finance/", include("finance.urls")),
    path("api/reports/", include("reports.urls")),
    path("api/hundi/", include("hundi.urls")),
    path("api/annadhanam/", include("annadhanam.urls")),
    path("api/queues/", include("queues.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/audit_logs/", include("audit_logs.urls")),
    path("api/panchangam/", include("panchangam.urls")),
    path("api/shipping/", include("shipments.urls")),
    path("api/leads/", include("leads.urls")),
    path("api/core/", include("core.urls")),
    path("api/assets/", include("assets.urls")),
    
    # Social Auth
    path("accounts/", include("allauth.urls")),
]

# Serve uploaded media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
