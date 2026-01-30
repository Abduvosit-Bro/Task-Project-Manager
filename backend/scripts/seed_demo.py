import os
import sys
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
sys.path.append(BASE_DIR)

django.setup()

from django.core.management import call_command  # noqa: E402

if __name__ == '__main__':
    call_command('seed_demo')
