from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0002_alter_user_managers_alter_user_groups'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='preferred_language',
            field=models.CharField(choices=[('ja', 'Japanese'), ('uz', 'Uzbek'), ('ru', 'Russian')], default='ja', max_length=2),
        ),
    ]
