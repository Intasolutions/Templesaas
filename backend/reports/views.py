from datetime import date
from django.db.models import Sum, Count, Q, F
from django.db.models.functions import TruncMonth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from core.permissions import ModulePermission
from rest_framework.response import Response

from bookings.models import Booking
from finance.models import Transaction
from inventory.models import Item
from events.models import Event
from pooja.models import Pooja
from devotees.models import Devotee


@api_view(["GET"])
@permission_classes([IsAuthenticated, ModulePermission])
def dashboard_stats(request):
    """
    Module 11: Dashboard
    Aggregates key metrics for the landing page.
    """
    tenant = getattr(request, "tenant", None)
    
    today = date.today()

    # 1. Today's Poojas Count (Bookings for today)
    today_bookings_qs = Booking.objects.filter(booking_date=today)
    if tenant:
        today_bookings_qs = today_bookings_qs.filter(organization=tenant)
    today_poojas_count = today_bookings_qs.count()

    # 2. Total Bookings (All time)
    total_bookings_qs = Booking.objects.all()
    if tenant:
        total_bookings_qs = total_bookings_qs.filter(organization=tenant)
    total_bookings = total_bookings_qs.count()

    # 3. Today's Income (Finance Transactions)
    income_qs = Transaction.objects.filter(txn_type=Transaction.TYPE_INCOME, date=today)
    if tenant:
        income_qs = income_qs.filter(organization=tenant)
    
    today_income_agg = income_qs.aggregate(total=Sum("amount"))
    today_income = today_income_agg["total"] or 0

    # 4. Total Devotees
    devotees_qs = Devotee.objects.all()
    if tenant:
        devotees_qs = devotees_qs.filter(organization=tenant)
    total_devotees = devotees_qs.count()

    # 5. Inventory Warnings (Low Stock)
    low_stock_qs = Item.objects.filter(
        is_active=True,
        reorder_level__gt=0,
        current_stock__lte=F("reorder_level")
    )
    if tenant:
        low_stock_qs = low_stock_qs.filter(organization=tenant)
    low_stock_items = low_stock_qs.count()

    # 5. Upcoming Festivals (Next 30 days)
    upcoming_qs = Event.objects.filter(
        is_active=True,
        start_date__gte=today
    ).order_by("start_date")
    if tenant:
        upcoming_qs = upcoming_qs.filter(organization=tenant)
        
    upcoming_festivals = upcoming_qs[:5].values("id", "name", "start_date")

    return Response({
        "metrics": {
            "today_poojas": today_poojas_count,
            "total_bookings": total_bookings,
            "total_devotees": total_devotees,
            "today_income": today_income,
            "low_stock_count": low_stock_items,
        },
        "upcoming_festivals": list(upcoming_festivals)
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, ModulePermission])
def financial_report(request):
    """
    Module 9/Reports: Monthly/Annual Financial Report.
    Params: 
      - period: 'month' (default) or 'year'
      - date: YYYY-MM-DD (reference date)
    """
    tenant = getattr(request, "tenant", None)
        
    date_str = request.GET.get("date", str(date.today()))
    period = request.GET.get("period", "month")
    
    try:
        ref_date = date.fromisoformat(date_str)
    except ValueError:
        return Response({"error": "Invalid date format YYYY-MM-DD"}, status=400)

    # Filter Setup
    qs = Transaction.objects.all()
    if tenant:
        qs = qs.filter(organization=tenant)
    
    if period == "year":
        qs_current = qs.filter(date__year=ref_date.year)
    else:
        qs_current = qs.filter(date__year=ref_date.year, date__month=ref_date.month)

    # Aggregates
    income = qs_current.filter(txn_type=Transaction.TYPE_INCOME).aggregate(total=Sum("amount"))["total"] or 0
    expense = qs_current.filter(txn_type=Transaction.TYPE_EXPENSE).aggregate(total=Sum("amount"))["total"] or 0
    
    # Granular Breakdown
    breakdown = (
        qs_current.filter(txn_type=Transaction.TYPE_INCOME)
          .values("title")
          .annotate(total=Sum("amount"))
          .order_by("-total")
    )
    
    # Recent Transactions
    recent_txns = qs.order_by("-date", "-id")[:10].values(
        "id", "date", "title", "txn_type", "amount"
    )

    # 6 Month Trends
    months_data = {}
    for i in range(5, -1, -1):
        m = ref_date.month - i
        y = ref_date.year
        if m <= 0:
            m += 12
            y -= 1
        m_date = date(y, m, 1)
        months_data[m_date.strftime("%Y-%m")] = {"name": m_date.strftime("%b"), "income": 0, "expense": 0}

    six_months_ago_str = list(months_data.keys())[0] + "-01"
    
    trends_qs = qs.filter(date__gte=six_months_ago_str).annotate(
        month=TruncMonth('date')
    ).values("month", "txn_type").annotate(
        total=Sum("amount")
    ).order_by("month")

    for t in trends_qs:
        m_str = t["month"].strftime("%Y-%m")
        if m_str in months_data:
            if t["txn_type"] == Transaction.TYPE_INCOME:
                months_data[m_str]["income"] += float(t["total"] or 0)
            else:
                months_data[m_str]["expense"] += float(t["total"] or 0)

    return Response({
        "period": period,
        "ref_date": date_str,
        "summary": {
            "total_income": float(income),
            "total_expense": float(expense),
            "net_balance": float(income - expense)
        },
        "breakdown": [{"name": b["title"] or "Income", "value": float(b["total"])} for b in breakdown],
        "recent_transactions": [
            {
                "id": f"TRX-{t['id']}",
                "date": t["date"].strftime("%b %d, %Y"),
                "desc": t["title"],
                "category": str(t["txn_type"]).title(),
                "amount": float(t["amount"]),
                "type": "credit" if t["txn_type"] == "income" else "debit",
                "timestamp": Transaction.objects.get(id=t["id"]).created_at.isoformat() if Transaction.objects.filter(id=t["id"]).exists() else None
            } for t in recent_txns
        ],
        "trends": list(months_data.values())
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, ModulePermission])
def daybook_report(request):
    """
    Daybook API: Calculates opening balance, lists daily transactions, and closing balance.
    """
    tenant = getattr(request, "tenant", None)
    date_str = request.GET.get("date", str(date.today()))
    page = request.GET.get("page", 1)
    page_size = request.GET.get("page_size", 10)
    
    try:
        query_date = date.fromisoformat(date_str)
    except ValueError:
        return Response({"error": "Invalid date format YYYY-MM-DD"}, status=400)

    # Base Queryset
    qs = Transaction.objects.all()
    if tenant:
        qs = qs.filter(organization=tenant)

    # 1. Opening Balance (All transactions before the query_date)
    past_txns = qs.filter(date__lt=query_date)
    past_income = past_txns.filter(txn_type=Transaction.TYPE_INCOME).aggregate(total=Sum("amount"))["total"] or 0
    past_expense = past_txns.filter(txn_type=Transaction.TYPE_EXPENSE).aggregate(total=Sum("amount"))["total"] or 0
    opening_balance = past_income - past_expense

    # 2. Today's Transactions
    today_txns = qs.filter(date=query_date).order_by("created_at")
    
    # Advanced Filtering
    bank_account_id = request.GET.get("bank_account_id")
    if bank_account_id:
        today_txns = today_txns.filter(bank_account_id=bank_account_id)
    
    payment_mode = request.GET.get("payment_mode")
    if payment_mode:
        today_txns = today_txns.filter(payment_mode=payment_mode)

    # 3. Breakdown by Payment Mode (For "How much in Cash vs Bank")
    mode_summary = today_txns.values("payment_mode").annotate(
        total_income=Sum("amount", filter=Q(txn_type=Transaction.TYPE_INCOME)),
        total_expense=Sum("amount", filter=Q(txn_type=Transaction.TYPE_EXPENSE))
    )
    
    formatted_mode_summary = {
        mode: {
            "income": float(item["total_income"] or 0),
            "expense": float(item["total_expense"] or 0),
            "net": float((item["total_income"] or 0) - (item["total_expense"] or 0))
        } for item in mode_summary for mode, label in Transaction.PAYMODE_CHOICES if item["payment_mode"] == mode
    }

    today_income = today_txns.filter(txn_type=Transaction.TYPE_INCOME).aggregate(total=Sum("amount"))["total"] or 0
    today_expense = today_txns.filter(txn_type=Transaction.TYPE_EXPENSE).aggregate(total=Sum("amount"))["total"] or 0
    closing_balance = opening_balance + today_income - today_expense

    from django.core.paginator import Paginator
    paginator = Paginator(today_txns, page_size)
    p_txns = paginator.get_page(page)

    # Format transactions for display
    transactions = [
        {
            "id": f"TRX-{t.id}",
            "time": t.created_at.isoformat(),
            "desc": t.title,
            "category": str(t.category).replace("_", " ").title(),
            "payment_mode": t.get_payment_mode_display() if hasattr(t, 'get_payment_mode_display') else "Cash",
            "bank_account": t.bank_account.name if hasattr(t, 'bank_account') and t.bank_account else None,
            "income": float(t.amount) if t.txn_type == Transaction.TYPE_INCOME else 0,
            "expense": float(t.amount) if t.txn_type == Transaction.TYPE_EXPENSE else 0,
        } for t in p_txns
    ]

    return Response({
        "date": date_str,
        "opening_balance": float(opening_balance),
        "total_income": float(today_income),
        "total_expense": float(today_expense),
        "closing_balance": float(closing_balance),
        "mode_summary": formatted_mode_summary,
        "transactions": transactions,
        "pagination": {
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": p_txns.number,
            "has_next": p_txns.has_next(),
            "has_previous": p_txns.has_previous()
        }
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, ModulePermission])
def profit_loss_report(request):
    """
    Financial Summary: Income vs Expense with breakdown by category and flow.
    """
    tenant = getattr(request, "tenant", None)
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")
    
    qs = Transaction.objects.all()
    if tenant:
        qs = qs.filter(organization=tenant)
    
    if start_date:
        qs = qs.filter(date__gte=start_date)
    if end_date:
        qs = qs.filter(date__lte=end_date)
        
    # Total Summaries
    totals = qs.aggregate(
        income=Sum("amount", filter=Q(txn_type=Transaction.TYPE_INCOME)),
        expense=Sum("amount", filter=Q(txn_type=Transaction.TYPE_EXPENSE))
    )
    
    # Category-wise Breakdown
    category_data = qs.values("category", "txn_type").annotate(total=Sum("amount")).order_by("category")
    
    # Flow-wise Breakdown (Cash vs Bank)
    flow_data = qs.values("payment_mode", "txn_type").annotate(total=Sum("amount")).order_by("payment_mode")
    
    return Response({
        "summary": {
            "total_income": float(totals["income"] or 0),
            "total_expense": float(totals["expense"] or 0),
            "net_profit": float((totals["income"] or 0) - (totals["expense"] or 0))
        },
        "breakdown_by_category": [
            {
                "category": dict(Transaction.CATEGORY_CHOICES).get(item["category"], item["category"]),
                "type": item["txn_type"],
                "total": float(item["total"] or 0)
            } for item in category_data
        ],
        "breakdown_by_flow": [
            {
                "mode": dict(Transaction.PAYMODE_CHOICES).get(item["payment_mode"], item["payment_mode"]),
                "type": item["txn_type"],
                "total": float(item["total"] or 0)
            } for item in flow_data
        ]
    })
