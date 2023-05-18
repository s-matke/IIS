from .models import Order
from django.utils import timezone
from .serializers import OrderSerializer
from django.db import transaction, DatabaseError

def check_order_delivery():
    print("Searching for orders...")
    delivered_orders = Order.objects.filter(expected_delivery_date__lt = timezone.now())

    if delivered_orders.count() == 0:
        print("No orders were delivered today. [", timezone.now(), "]")
    else:
        print("Removing ", delivered_orders.count(), " number of orders")
        delivered_orders.delete()
        print("Successfully removed...")