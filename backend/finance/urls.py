from django.urls import path
from .views import TransactionListCreateView, TransactionDetailView, finance_summary, BankAccountListCreateView, BankAccountDetailView

urlpatterns = [
    path("bank-accounts/", BankAccountListCreateView.as_view()),
    path("bank-accounts/<int:pk>/", BankAccountDetailView.as_view()),
    path("transactions/", TransactionListCreateView.as_view()),
    path("transactions/<int:pk>/", TransactionDetailView.as_view()),
    path("summary/", finance_summary),
]
