from django.db import models
from product.models import Product
from account.models import Account
# from production.models import ProductionOrder
from django.utils.translation import gettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_save

class Plan(models.Model):

    class PlanStatus(models.TextChoices):
        DECLINED = 'DECLINED', _('Declined')
        APPROVED = 'APPROVED', _('Approved')
        PENDING = 'PENDING', _('Pending')

    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False)
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)
    producable_amount = models.PositiveIntegerField(null=False)
    production_cost = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    planner = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
    status = models.CharField(choices=PlanStatus.choices, default=PlanStatus.PENDING)


class PlanQueue(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)


@receiver(post_save, sender=Plan)
def add_plan_to_queue(sender, instance, created, **kwargs):
    if created:
        PlanQueue.objects.create(plan=instance)

# @receiver(post_save, sender=ProductionOrder)
# def update_plan_status(sender, instance, created, **kwargs):
#     if created:
#         plan_to_update = Plan.objects.get(plan=instance.plan)
#         plan_to_update.status = Plan.PlanStatus.APPROVED
#         plan_to_update.save()
