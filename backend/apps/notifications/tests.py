from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.projects.models import Project, ProjectMember
from apps.tasks.models import Task
from apps.notifications.tasks import schedule_notifications
from apps.notifications.models import Notification

User = get_user_model()


class NotificationSchedulerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='user@example.com', password='password123')
        self.project = Project.objects.create(owner=self.user, name_ja='PJ', name_uz='PJ')
        ProjectMember.objects.create(project=self.project, user=self.user, role='owner')
        self.task = Task.objects.create(
            project=self.project,
            created_by=self.user,
            title_ja='Task',
            title_uz='Vazifa',
            due_at=timezone.now() + timedelta(hours=2),
            status='todo',
        )

    def test_dedup_scheduler(self):
        schedule_notifications()
        schedule_notifications()
        self.assertEqual(Notification.objects.count(), 1)
