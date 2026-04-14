from django.utils import timezone
from rest_framework import generics
from .models import QueueSession, Token
from .serializers import QueueSessionSerializer, TokenSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from core.utils import TenantMixin

from rest_framework.permissions import AllowAny

class QueueSessionListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = QueueSession
    serializer_class = QueueSessionSerializer
    permission_classes = [AllowAny]

class QueueSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = QueueSession.objects.all()
    serializer_class = QueueSessionSerializer
    permission_classes = [AllowAny]

class TokenListCreateView(TenantMixin, generics.ListCreateAPIView):
    model = Token
    serializer_class = TokenSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        tenant = getattr(self.request, "tenant", None)
        session = serializer.validated_data.get("session")
        session.last_issued_number += 1
        session.save()
        serializer.save(organization=tenant, number=session.last_issued_number)

@api_view(["POST"])
@permission_classes([AllowAny])
def call_next_api(request, pk):
    """
    Increments serving number and updates token statuses.
    """
    try:
        session = QueueSession.objects.get(pk=pk)
    except QueueSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)

    if session.current_token_number >= session.last_issued_number:
        return Response({"error": "No more tokens waiting"}, status=400)

    # 1. Complete the previous token
    Token.objects.filter(session=session, number=session.current_token_number).update(
        status=Token.STATUS_COMPLETED, completed_at=timezone.now()
    )

    # 2. Increment session
    session.current_token_number += 1
    session.save()

    # 3. Set new token to Serving
    Token.objects.filter(session=session, number=session.current_token_number).update(status=Token.STATUS_SERVING)
    
    # 4. (Optional) Send SMS
    token = Token.objects.filter(session=session, number=session.current_token_number).first()
    if token:
        token.send_sms_notification()

    return Response(QueueSessionSerializer(session).data)

@api_view(["GET"])
@permission_classes([AllowAny])
def tv_display_api(request):
    """
    Returns 'Now Serving' info for all active queue sessions for the current tenant.
    """
    tenant = getattr(request, "tenant", None)
    if not tenant:
        return Response({"tv_display": []})

    sessions = QueueSession.objects.filter(organization=tenant, status=QueueSession.STATUS_ACTIVE)
    results = []
    for s in sessions:
        results.append({
            "session_name": s.name,
            "now_serving": s.current_token_number,
            "last_issued": s.last_issued_number,
            "wait_time_estimate": s.avg_wait_time_minutes
        })
    return Response({"tv_display": results})
