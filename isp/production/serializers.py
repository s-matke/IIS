from rest_framework import serializers
from .models import ProductionOrder
from plan.serializers import PlanSerializer
from machine.serializers import MachineSerializer

class ProductionOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionOrder
        fields = ['id', 'plan', 'priority', 'manager', 'added_on', 'machine', 'state']

class DetailedProductionOrderSerializer(serializers.ModelSerializer):
    plan = PlanSerializer()
    machine = MachineSerializer()
    class Meta:
        model = ProductionOrder
        fields = ['id', 'plan', 'priority', 'machine', 'state']

# class CustomProductionOrderSerializer(serializers.ModelSerializer):
#     start_date = serializers.SerializerMethodField()
#     end_date = serializers.SerializerMethodField()
#     production_cost = serializers.SerializerMethodField()
#     machine_name = serializers.SerializerMethodField()

#     class Meta:
#         model = ProductionOrder
#         fields = ['id', 'plan', 'start_date', 'end_date', 'production_cost', 'machine_name', 'priority', 'state']
    
#     def get_start_date(self, obj):
#         plan
