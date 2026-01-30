from datetime import timedelta
from django.utils import timezone
from celery import shared_task

from apps.tasks.models import Task
from apps.events.models import CalendarEvent
from .models import Notification
from apps.common.utils import scheduled_bucket


@shared_task
def schedule_notifications():
    now = timezone.now()
    task_window = now + timedelta(hours=24)
    event_window = now + timedelta(hours=1)

    tasks = Task.objects.filter(due_at__isnull=False, due_at__gte=now, due_at__lte=task_window).exclude(status='done')
    for task in tasks:
        scheduled_for = task.due_at
        bucket = scheduled_bucket(scheduled_for)
        Notification.objects.get_or_create(
            user=task.assigned_to or task.created_by,
            type='due_soon',
            entity_type='task',
            entity_id=str(task.id),
            scheduled_for_bucket=bucket,
            defaults={'scheduled_for': scheduled_for, 'channel': 'in_app'},
        )

    events = CalendarEvent.objects.filter(start_at__gte=now, start_at__lte=event_window)
    for event in events:
        scheduled_for = event.start_at
        bucket = scheduled_bucket(scheduled_for)
        Notification.objects.get_or_create(
            user=event.created_by,
            type='event_soon',
            entity_type='event',
            entity_id=str(event.id),
            scheduled_for_bucket=bucket,
            defaults={'scheduled_for': scheduled_for, 'channel': 'in_app'},
        )
