from django.urls import path
from .views import TransactionListCreateView, TransactionDetailView, finance_summary

urlpatterns = [
    path("transactions/", TransactionListCreateView.as_view()),
    path("transactions/<int:pk>/", TransactionDetailView.as_view()),
    path("summary/", finance_summary),
]
