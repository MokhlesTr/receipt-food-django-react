import os
import django
from datetime import timedelta, date
from django.utils import timezone
import random
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Category, FoodItem, Transaction

def seed():
    print("Seeding targeted user accounts...")

    # Create empty user
    user_test, _ = User.objects.get_or_create(username='test', email='test@example.com')
    user_test.set_password('test456')
    user_test.save()
    
    Category.objects.filter(user=user_test).delete() # Clear existing data just in case
    FoodItem.objects.filter(user=user_test).delete()
    Transaction.objects.filter(user=user_test).delete()
    print("Created user 'test' (empty data).")

    # Create full user
    user_mokh, _ = User.objects.get_or_create(username='mokh', email='mokh@example.com')
    user_mokh.set_password('test456')
    user_mokh.save()
    
    # Reset data for mokh to avoid duplication if run multiple times
    Category.objects.filter(user=user_mokh).delete()
    
    categories = ['Vegetables', 'Fruits', 'Meat', 'Dairy', 'Pantry', 'Seafood', 'Snacks']
    cat_objs = {}
    for cat_name in categories:
        cat_objs[cat_name] = Category.objects.create(user=user_mokh, name=cat_name, description=f"All {cat_name.lower()}")
    
    items_map = {
        'Vegetables': [('Carrots', 'kg'), ('Potatoes', 'kg'), ('Onions', 'kg')],
        'Fruits': [('Apples', 'kg'), ('Bananas', 'bunches'), ('Oranges', 'kg')],
        'Meat': [('Chicken Breast', 'kg'), ('Ground Beef', 'kg'), ('Pork Chops', 'kg')],
        'Dairy': [('Milk', 'liters'), ('Cheese', 'kg'), ('Yogurt', 'cups')],
        'Pantry': [('Rice', 'kg'), ('Olive Oil', 'bottles'), ('Pasta', 'boxes')],
        'Seafood': [('Salmon', 'kg'), ('Shrimp', 'kg')],
        'Snacks': [('Chips', 'bags'), ('Cookies', 'boxes')]
    }

    today = date.today()
    for cat_name, items in items_map.items():
        cat = cat_objs[cat_name]
        for name, unit in items:
            quantity = Decimal(random.uniform(10.0, 100.0)).quantize(Decimal('0.01'))
            price = Decimal(random.uniform(2.0, 35.0)).quantize(Decimal('0.01'))
            item = FoodItem.objects.create(
                user=user_mokh, category=cat, name=name, quantity=quantity, unit=unit,
                expiration_date=today + timedelta(days=random.randint(-2, 45)),
                min_stock_level=Decimal('10.00'), price=price
            )
            
            # Generate random transactions for the past 14 days
            for _ in range(random.randint(4, 8)):
                tx_type = random.choice(['BUY', 'BUY', 'SELL']) # More buys to keep stock positive usually
                tx_qty = Decimal(random.uniform(1.0, 15.0)).quantize(Decimal('0.01'))
                tx = Transaction.objects.create(
                    user=user_mokh, item=item, transaction_type=tx_type,
                    quantity=tx_qty, price_per_unit=price
                )
                tx.date = timezone.now() - timedelta(days=random.randint(0, 13))
                tx.save()

    print("Created user 'mokh' (full of data).")
    print("Seed complete!")

if __name__ == '__main__':
    seed()
