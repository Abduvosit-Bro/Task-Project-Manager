from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='TranslationLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('entity_type', models.CharField(max_length=32)),
                ('entity_id', models.CharField(max_length=64)),
                ('source_lang', models.CharField(max_length=2)),
                ('target_lang', models.CharField(max_length=2)),
                ('provider', models.CharField(max_length=32)),
                ('source_hash', models.CharField(max_length=64)),
                ('translated_text', models.TextField()),
            ],
        ),
    ]
