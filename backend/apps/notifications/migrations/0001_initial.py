from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('type', models.CharField(choices=[('due_soon', 'Due Soon'), ('event_soon', 'Event Soon')], max_length=32)),
                ('entity_type', models.CharField(choices=[('task', 'Task'), ('event', 'Event')], max_length=32)),
                ('entity_id', models.CharField(max_length=64)),
                ('scheduled_for', models.DateTimeField()),
                ('scheduled_for_bucket', models.DateTimeField()),
                ('sent_at', models.DateTimeField(blank=True, null=True)),
                ('is_read', models.BooleanField(default=False)),
                ('channel', models.CharField(choices=[('in_app', 'In App')], default='in_app', max_length=32)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={'unique_together': {('user', 'type', 'entity_type', 'entity_id', 'scheduled_for_bucket')}},
        ),
    ]
