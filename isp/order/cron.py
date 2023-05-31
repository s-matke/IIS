from .models import Order
from django.utils import timezone
from .serializers import OrderSerializer
from django.db import transaction, DatabaseError
from pytz import timezone
import datetime

def check_order_delivery():
    delivered_orders = Order.objects.filter(expected_delivery_date__lte = datetime.datetime.now())

    if delivered_orders.count() == 0:
        print(time_log() + " [INFO] No orders were delivered today.")
    else:
        try:
            print(time_log() + " [INFO] Removing ", delivered_orders.count(), " number of orders")
            delivered_orders.delete()
        except:
            print(time_log() + " [ERROR] Failed to remove delivered orders.")
    
def time_log():
    return datetime.datetime.now().strftime('[%H:%M %d/%m/%Y]')