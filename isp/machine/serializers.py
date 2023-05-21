from rest_framework import serializers
from .models import Machine

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'name', 'version', 'release_date', 'price', 'health', 'produced_amount', 'last_diagnosis', 'purchase_date']