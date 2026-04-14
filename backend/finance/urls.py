from django.urls import path
from .views import TransactionListCreateView, TransactionDetailView

urlpatterns = [
    path("transactions/", TransactionListCreateView.as_view()),
    path("transactions/<int:pk>/", TransactionDetailView.as_view()),
]
