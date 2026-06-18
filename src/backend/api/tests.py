# pyrefly: ignore [missing-import]
from django.urls import reverse
# pyrefly: ignore [missing-import]
from rest_framework import status
# pyrefly: ignore [missing-import]
from rest_framework.test import APITestCase
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User
from .models import FoodItem, Category

class AuthenticationTests(APITestCase):
    def test_registration(self):
        url = reverse('register')
        data = {'username': 'testuser', 'password': 'testpassword123', 'email': 'test@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class FoodItemTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.category = Category.objects.create(name='Fruits', user=self.user)
        self.client.force_authenticate(user=self.user)
        self.url = reverse('inventory-list')

    def test_create_item(self):
        data = {
            'name': 'Apple',
            'category': self.category.id,
            'quantity': '10.00',
            'unit': 'kg',
            'price': '2.50',
            'min_stock_level': '5.00'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
