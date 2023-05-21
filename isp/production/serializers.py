from rest_framework import serializers
from .models import ProductionOrder

class ProductionOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionOrder
        fields = ['id', 'plan', 'priority', 'manager', 'added_on']