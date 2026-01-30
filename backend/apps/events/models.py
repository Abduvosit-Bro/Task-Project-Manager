from django.db import models
from django.conf import settings
from apps.common.mixins import TimeStampedModel
from apps.projects.models import Project
from apps.tags.models import Tag


class CalendarEvent(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='events')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events_created')

    title_ja = models.CharField(max_length=200)
    title_uz = models.CharField(max_length=200)
    description_ja = models.TextField(blank=True, null=True)
    description_uz = models.TextField(blank=True, null=True)

    start_at = models.DateTimeField()
    end_at = models.DateTimeField(blank=True, null=True)
    all_day = models.BooleanField(default=False)
    location = models.CharField(max_length=255, blank=True, null=True)

    tags = models.ManyToManyField(Tag, related_name='events', blank=True)

    def __str__(self):
        return self.title_ja or self.title_uz
