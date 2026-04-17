from django.urls import path
from .views import (
    DevoteeListCreateView,
    DevoteeDetailView,
    GothraListCreateView,
    GothraDetailView,
    NakshatraListCreateView,
    NakshatraDetailView,
    DevoteeFullDetailView,
    DevoteeExportCSVView,
    DevoteeExportExcelView,
    DevoteeExportPDFView,
    DevoteeStatsView,
)

app_name = "devotees"

urlpatterns = [
    # Devotee CRUD + search + filters
    path("", DevoteeListCreateView.as_view(), name="devotee-list-create"),
    path("<int:pk>/", DevoteeDetailView.as_view(), name="devotee-detail"),
    path("<int:pk>/details/", DevoteeFullDetailView.as_view(), name="devotee-full-detail"),

    # Master data (lookup tables)
    path("gothra/", GothraListCreateView.as_view(), name="gothra-list-create"),
    path("gothra/<int:pk>/", GothraDetailView.as_view(), name="gothra-detail"),
    path("nakshatra/", NakshatraListCreateView.as_view(), name="nakshatra-list-create"),
    path("nakshatra/<int:pk>/", NakshatraDetailView.as_view(), name="nakshatra-detail"),

    # Export
    path("export/csv/", DevoteeExportCSVView.as_view(), name="devotee-export-csv"),
    path("export/excel/", DevoteeExportExcelView.as_view(), name="devotee-export-excel"),
    path("export/pdf/", DevoteeExportPDFView.as_view(), name="devotee-export-pdf"),
    path("stats/", DevoteeStatsView.as_view(), name="devotee-stats"),
]
