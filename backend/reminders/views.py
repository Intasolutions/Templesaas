from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Reminder
from .serializers import ReminderSerializer

class ReminderListCreateView(generics.ListCreateAPIView):
    """
    Module 13: Internal Reminders & Tasking
    """
    queryset = Reminder.objects.all().order_by('due_date', '-is_urgent')
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # We assume the logged-in user is an admin or staff.
        # Filtering by tenant would be handled here too if relevant.
        return super().get_queryset()

    def list(self, request, *args, **kwargs):
        """
        Special check for no_pagination=true as requested in production logs.
        """
        no_pagination = request.query_params.get("no_pagination") == "true"
        if no_pagination:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return super().list(request, *args, **kwargs)

class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

from rest_framework.response import Response
