from django.db import models
from django.conf import settings
from apps.common.mixins import TimeStampedModel


class Project(TimeStampedModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_projects')
    name_ja = models.CharField(max_length=200)
    name_uz = models.CharField(max_length=200)
    description_ja = models.TextField(blank=True, null=True)
    description_uz = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=32, blank=True, null=True)
    subject_ja = models.CharField(max_length=200, blank=True, null=True)
    subject_uz = models.CharField(max_length=200, blank=True, null=True)
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return self.name_ja or self.name_uz


class ProjectMember(TimeStampedModel):
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('member', 'Member'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_memberships')
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default='member')
    status = models.CharField(
        max_length=16,
        choices=(('pending', 'Pending'), ('active', 'Active'), ('rejected', 'Rejected')),
        default='active'
    )
    invited_at = models.DateTimeField(blank=True, null=True)
    joined_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ('project', 'user')

    def __str__(self):
        return f'{self.project_id}:{self.user_id}({self.role})'
