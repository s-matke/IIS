from .models import *
from rest_framework import serializers

class ProductInventorySerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductInventory
        fields = ['id', 'product', 'quantity', 'product_name']
    
    def get_product_name(self, obj):
        return obj.product.name if obj.product else None

class MaterialInventorySerializer(serializers.ModelSerializer):
    material_name = serializers.SerializerMethodField()
    min_amount = serializers.SerializerMethodField()
    max_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = MaterialInventory
        fields = ['id', 'material', 'quantity', 'recent_issued_order', 'material_name', 'max_amount', 'min_amount']
    
    def get_material_name(self, obj):
        return obj.material.name if obj.material else None

    def get_max_amount(self, obj):
        return obj.material.max_amount if obj.material else None

    def get_min_amount(self, obj):
        return obj.material.min_amount if obj.material else None
