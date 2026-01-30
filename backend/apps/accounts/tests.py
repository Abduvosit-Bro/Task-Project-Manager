from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


class ProfileUpdateTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='profile@example.com', password='password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_update_profile_fields(self):
        payload = {
            'first_name': 'Ivan',
            'last_name': 'Petrov',
            'student_id': 'S12345',
            'timezone': 'Asia/Tashkent',
        }
        response = self.client.patch('/api/auth/me', payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Ivan')
        self.assertEqual(self.user.last_name, 'Petrov')
        self.assertEqual(self.user.student_id, 'S12345')
