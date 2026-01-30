from django.db import models
from django.conf import settings
from apps.common.mixins import TimeStampedModel
from apps.common.utils import scheduled_bucket


class Notification(TimeStampedModel):
    TYPE_CHOICES = (
        ('due_soon', 'Due Soon'),
        ('event_soon', 'Event Soon'),
    )
    ENTITY_CHOICES = (
        ('task', 'Task'),
        ('event', 'Event'),
    )
    CHANNEL_CHOICES = (
        ('in_app', 'In App'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=32, choices=TYPE_CHOICES)
    entity_type = models.CharField(max_length=32, choices=ENTITY_CHOICES)
    entity_id = models.CharField(max_length=64)
    scheduled_for = models.DateTimeField()
    scheduled_for_bucket = models.DateTimeField()
    sent_at = models.DateTimeField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    channel = models.CharField(max_length=32, choices=CHANNEL_CHOICES, default='in_app')

    class Meta:
        unique_together = ('user', 'type', 'entity_type', 'entity_id', 'scheduled_for_bucket')

    def save(self, *args, **kwargs):
        if self.scheduled_for and not self.scheduled_for_bucket:
            self.scheduled_for_bucket = scheduled_bucket(self.scheduled_for)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.type}:{self.entity_type}:{self.entity_id}'
