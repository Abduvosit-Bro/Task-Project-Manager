from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('projects', '0001_initial'),
        ('tags', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CalendarEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title_ja', models.CharField(max_length=200)),
                ('title_uz', models.CharField(max_length=200)),
                ('description_ja', models.TextField(blank=True, null=True)),
                ('description_uz', models.TextField(blank=True, null=True)),
                ('start_at', models.DateTimeField()),
                ('end_at', models.DateTimeField(blank=True, null=True)),
                ('all_day', models.BooleanField(default=False)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events_created', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='projects.project')),
                ('tags', models.ManyToManyField(blank=True, related_name='events', to='tags.tag')),
            ],
        ),
    ]
