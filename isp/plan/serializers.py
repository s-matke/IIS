from rest_framework import serializers
from .models import Plan, PlanQueue
from .validators import EndBeforeStartValidator, WithinWorkingHoursValidator


class PlanSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = Plan
        fields = ['id', 'product', 'start_date', 'end_date', 'producable_amount', 'production_cost', 'planner', 'status', 'product_name']
        validators = [
            EndBeforeStartValidator(
                start_date_field="start_date",
                end_date_field="end_date"
            ),
            WithinWorkingHoursValidator(
                start_date_field="start_date",
                end_date_field="end_date"
            )
        ]
    
    def get_product_name(self, obj):
        return obj.product.name if obj.product else None

class PlanQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanQueue
        fields = ['id', 'plan', 'created'] 