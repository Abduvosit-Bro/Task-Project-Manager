from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer, NotificationDetailSerializer


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')[:100]  # Limit to recent 100


class NotificationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationDetailSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.select_related('user')

    def get_object(self):
        obj = super().get_object()
        if obj.user_id != self.request.user.id:
            self.permission_denied(self.request)
        return obj

    def patch(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = request.data.get('is_read', True)
        if notification.is_read and not notification.sent_at:
            notification.sent_at = timezone.now()
        notification.save(update_fields=['is_read', 'sent_at'])
        return Response(NotificationDetailSerializer(notification).data)


class MarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        now = timezone.now()
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True, sent_at=now)
        return Response({'detail': 'all marked read'}, status=status.HTTP_200_OK)
