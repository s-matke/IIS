from rest_framework import serializers
from .models import Plan, PlanQueue
from .validators import EndBeforeStartValidator, WithinWorkingHoursValidator


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'product', 'start_date', 'end_date', 'producable_amount', 'production_cost', 'planner', 'status']
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

class PlanQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanQueue
        fields = ['id', 'plan', 'created'] 