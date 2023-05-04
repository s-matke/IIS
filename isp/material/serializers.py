from .models import Material, BillOfMaterial
from rest_framework import serializers

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'name', 'description', 'price', 'supplier', 'created']

class BillOfMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillOfMaterial
        fields = ['id', 'product', 'material', 'quantity']