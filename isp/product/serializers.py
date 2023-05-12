from .models import Product
from rest_framework import serializers
from material.serializers import BillOfMaterialShortSerializer
from material.models import BillOfMaterial


class ProductSerializer(serializers.ModelSerializer):
    # bom = BillOfMaterialSerializer(many=True, read_only=True)
    bom = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'created', 'status', 'lead_time', 'price_of_producing', 'planner', 'bom']
    
    def get_bom(self, obj):
        bom_objects = BillOfMaterial.objects.filter(product=obj)
        return BillOfMaterialShortSerializer(bom_objects, many=True).data