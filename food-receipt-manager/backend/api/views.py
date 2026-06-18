from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Sum, F, Count
from django.utils import timezone
from datetime import timedelta
from .models import Category, FoodItem, Transaction
from .serializers import UserSerializer, CategorySerializer, FoodItemSerializer, TransactionSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FoodItemViewSet(viewsets.ModelViewSet):
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FoodItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        items = FoodItem.objects.filter(user=user)
        transactions = Transaction.objects.filter(user=user)
        
        total_items = items.count()
        low_stock_items = items.filter(quantity__lte=F('min_stock_level')).count()

        categories = items.values('category__name').annotate(count=Count('id'))
        category_data = {item['category__name'] or 'Uncategorized': item['count'] for item in categories}

        # Last 7 days transactions for chart
        seven_days_ago = timezone.now() - timedelta(days=7)
        recent_txs = transactions.filter(date__gte=seven_days_ago)
        
        tx_data = []
        for i in range(7):
            day = (timezone.now() - timedelta(days=6-i)).date()
            day_txs = recent_txs.filter(date__date=day)
            buy_sum = day_txs.filter(transaction_type='BUY').aggregate(s=Sum('total_price'))['s'] or 0
            sell_sum = day_txs.filter(transaction_type='SELL').aggregate(s=Sum('total_price'))['s'] or 0
            tx_data.append({
                'date': day.strftime('%a'),
                'buy': buy_sum,
                'sell': sell_sum
            })

        return Response({
            'total_items': total_items,
            'low_stock_items': low_stock_items,
            'items_by_category': category_data,
            'transaction_history': tx_data,
        })
