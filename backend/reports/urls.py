from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.dashboard_stats, name="dashboard-stats"),
    path("finance-report/", views.financial_report, name="financial-report"),
    path("daybook/", views.daybook_report, name="daybook-report"),
    path("profit-loss/", views.profit_loss_report, name="profit-loss-report"),
]
