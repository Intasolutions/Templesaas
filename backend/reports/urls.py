from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.dashboard_stats, name="dashboard-stats"),
    path("finance-report/", views.financial_report, name="financial-report"),
]
