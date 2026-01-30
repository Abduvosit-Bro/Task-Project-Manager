from django.db import models
from django.conf import settings
from apps.common.mixins import TimeStampedModel
from apps.projects.models import Project
from apps.tags.models import Tag


class Task(TimeStampedModel):
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )
    STATUS_CHOICES = (
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    )

    projects = models.ManyToManyField(Project, related_name='tasks', blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks_created')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks_assigned')

    title_ja = models.CharField(max_length=200)
    title_uz = models.CharField(max_length=200)
    description_ja = models.TextField(blank=True, null=True)
    description_uz = models.TextField(blank=True, null=True)

    due_at = models.DateTimeField(blank=True, null=True)
    priority = models.CharField(max_length=16, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='todo')

    tags = models.ManyToManyField(Tag, related_name='tasks', blank=True)

    def __str__(self):
        return self.title_ja or self.title_uz
