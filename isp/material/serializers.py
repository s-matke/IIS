from .models import Material, BillOfMaterial
from rest_framework import serializers
from .validators import MaxLessThanMinValidator

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'name', 'description', 'price', 'supplier', 'created', 'min_amount', 'max_amount']
        validators = [MaxLessThanMinValidator(
            min_amount_field="min_amount",
            max_amount_field="max_amount"
        )]

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