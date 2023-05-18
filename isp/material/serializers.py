from .models import *
from rest_framework import serializers
from .validators import MaxLessThanMinValidator

class MaterialSerializer(serializers.ModelSerializer):
    supplier_name = serializers.SerializerMethodField()

    class Meta:
        model = Material
        fields = ['id', 'name', 'description', 'price', 'created', 'min_amount', 'max_amount', 'supplier', 'supplier_name']
        validators = [MaxLessThanMinValidator(
            min_amount_field="min_amount",
            max_amount_field="max_amount"
        )]
    
    def get_supplier_name(self, obj):
        return obj.supplier.name if obj.supplier else None

class BillOfMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillOfMaterial
        fields = ['id', 'product', 'material', 'quantity']

class BillOfMaterialShortSerializer(serializers.ModelSerializer):
    material_name = serializers.SerializerMethodField()

    class Meta:
        model = BillOfMaterial
        fields = ['id', 'material', 'material_name', 'quantity']
    
    def get_material_name(self, obj):
        return obj.material.name if obj.material else None

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'pib', 'address']