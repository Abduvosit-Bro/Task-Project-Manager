from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Tag

User = get_user_model()


class TagTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='tagger@example.com', password='password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_tag(self):
        response = self.client.post('/api/tags', {'name': 'Test'})
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Tag.objects.filter(owner=self.user, name='Test').exists())

    def test_update_tag(self):
        tag = Tag.objects.create(owner=self.user, name='Old')
        response = self.client.patch(f'/api/tags/{tag.id}', {'name': 'New'}, format='json')
        self.assertEqual(response.status_code, 200)
        tag.refresh_from_db()
        self.assertEqual(tag.name, 'New')
