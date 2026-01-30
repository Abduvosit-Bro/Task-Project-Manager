from django.test import TestCase
from .services import TranslationService


class TranslationServiceTests(TestCase):
    def test_fill_missing_uz(self):
        service = TranslationService()
        data = {'title_ja': '?????'}
        result = service.fill_missing(data, entity_type='task', entity_id='1')
        self.assertIn('title_uz', result)
        self.assertTrue(result['title_uz'].startswith('[UZ]'))

    def test_fill_missing_ja(self):
        service = TranslationService()
        data = {'title_uz': 'Salom'}
        result = service.fill_missing(data, entity_type='task', entity_id='1')
        self.assertIn('title_ja', result)
        self.assertTrue(result['title_ja'].startswith('[JA]'))
