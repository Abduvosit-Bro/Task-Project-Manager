from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.projects.models import Project, ProjectMember
from apps.tasks.models import Task
from apps.events.models import CalendarEvent
from apps.tags.models import Tag

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed demo data for local development.'

    def handle(self, *args, **options):
        user, _ = User.objects.get_or_create(
            email='demo@example.com',
            defaults={
                'display_name': 'Demo User',
                'first_name': 'Demo',
                'last_name': 'User',
                'student_id': 'S0001',
                'preferred_language': 'ja',
            },
        )
        user.set_password('password123')
        user.save()

        project, _ = Project.objects.get_or_create(
            owner=user,
            name_ja='デモプロジェクト',
            name_uz='Demo loyiha',
            defaults={'description_ja': 'デモ用の説明', 'description_uz': 'Namuna tavsifi'},
        )
        ProjectMember.objects.get_or_create(project=project, user=user, defaults={'role': 'owner', 'joined_at': timezone.now()})

        tag1, _ = Tag.objects.get_or_create(owner=user, name='Vazifa')
        tag2, _ = Tag.objects.get_or_create(owner=user, name='Muhim')

        task = Task.objects.create(
            created_by=user,
            title_ja='最初のタスク',
            title_uz='Birinchi vazifa',
            due_at=timezone.now() + timezone.timedelta(days=1),
        )
        task.projects.add(project)
        task.tags.set([tag1, tag2])

        event = CalendarEvent.objects.create(
            project=project,
            created_by=user,
            title_ja='最初のイベント',
            title_uz='Birinchi tadbir',
            start_at=timezone.now() + timezone.timedelta(hours=3),
            end_at=timezone.now() + timezone.timedelta(hours=4),
        )
        event.tags.set([tag1])

        self.stdout.write(self.style.SUCCESS('Demo data seeded. Login: demo@example.com / password123'))
