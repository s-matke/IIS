from rest_framework import serializers
from .models import *
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

class ProductionProgressSerializer(serializers.ModelSerializer):
    production = DetailedProductionOrderSerializer()
    lead_time = serializers.SerializerMethodField()

    class Meta:
        model = ProductionProgress
        fields = ['id', 'production', 'last_update', 'daily_produced', 'produced_tracker', 'lead_time']
    
    def get_lead_time(self, obj):
        return obj.production.plan.product.lead_time if obj.production else None