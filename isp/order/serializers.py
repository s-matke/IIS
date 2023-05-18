from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    ordered_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'material', 'ordered_by', 'issued_date', 'expected_delivery_date', 'ordered_quantity', 'ordered_by_name']
    
    def get_ordered_by_name(self, obj):
        return obj.ordered_by.user.get_full_name() if obj.ordered_by else None
