from django.urls import path
from .views import NotificationListView, NotificationDetailView, MarkAllReadView

urlpatterns = [
    path('notifications', NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:pk>', NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/mark-all-read', MarkAllReadView.as_view(), name='notifications-mark-all-read'),
]
