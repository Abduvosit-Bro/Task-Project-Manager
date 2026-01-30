from django.db import models
from django.conf import settings
from apps.common.mixins import TimeStampedModel


class Tag(TimeStampedModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=64)
    color = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        unique_together = ('owner', 'name')

    def __str__(self):
        return self.name
