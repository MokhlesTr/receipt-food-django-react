from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, FoodItem, Transaction

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('user',)

    def get_item_count(self, obj):
        return obj.items.count()

class FoodItemSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = FoodItem
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

    def get_is_low_stock(self, obj):
        return obj.quantity <= obj.min_stock_level

class TransactionSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('user', 'total_price', 'date')
