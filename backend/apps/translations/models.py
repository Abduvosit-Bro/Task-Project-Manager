from django.db import models
from apps.common.mixins import TimeStampedModel


class TranslationLog(TimeStampedModel):
    entity_type = models.CharField(max_length=32)
    entity_id = models.CharField(max_length=64)
    source_lang = models.CharField(max_length=2)
    target_lang = models.CharField(max_length=2)
    provider = models.CharField(max_length=32)
    source_hash = models.CharField(max_length=64)
    translated_text = models.TextField()

    def __str__(self):
        return f'{self.entity_type}:{self.entity_id} {self.source_lang}->{self.target_lang}'
