from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.projects.models import Project, ProjectMember
from apps.tasks.models import Task

User = get_user_model()


class TaskPermissionTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(email='owner@example.com', password='password123')
        self.other = User.objects.create_user(email='other@example.com', password='password123')
        self.project = Project.objects.create(owner=self.owner, name_ja='PJ', name_uz='PJ')
        ProjectMember.objects.create(project=self.project, user=self.owner, role='owner')
        self.task = Task.objects.create(
            project=self.project,
            created_by=self.owner,
            title_ja='Task',
            title_uz='Vazifa',
        )
        self.client = APIClient()

    def test_non_member_cannot_access_task(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.get(f'/api/tasks/{self.task.id}')
        self.assertEqual(response.status_code, 403)
