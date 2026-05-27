import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from finance.models import Transaction

today = date.today()
print(f"Today: {today}")

txns = Transaction.objects.filter(date=today)
print(f"Total transactions for today: {txns.count()}")

for t in txns:
    print(f"ID: {t.id}, Type: {t.txn_type}, Title: {t.title}, Amount: {t.amount}, Category: {t.category}, Org: {t.organization_id}")

expenses = txns.filter(txn_type=Transaction.TYPE_EXPENSE)
print(f"Expenses today: {expenses.count()}")
for e in expenses:
    print(f"Expense -> ID: {e.id}, Amount: {e.amount}")
