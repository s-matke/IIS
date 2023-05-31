from django.db import models
from plan.models import Plan
from account.models import Account
from machine.models import Machine
from django.utils.translation import gettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils import timezone
# Create your models here.

class ProductionOrder(models.Model):

    class ProductionStatus(models.TextChoices):
        FINISHED = 'FINISHED', _('Finished')        # production finished successfully
        CANCELLED = 'CANCELLED', _('Cancelled')     # aborted production
        ACTIVE = 'ACTIVE', _('Active')              # producing
        PENDING = 'PENDING', _('Pending')           # in queue, waiting for machine
        # INQUEUE = 'INQUEUE', _('INQUEUE')

    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, null=False)
    priority = models.PositiveSmallIntegerField(null=False, blank=False)
    manager = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
    added_on = models.DateField(auto_now_add=True)
    machine = models.ForeignKey(Machine, on_delete=models.SET_NULL, null=True, default=None)
    state = models.CharField(choices=ProductionStatus.choices, default=ProductionStatus.PENDING)
    # worker = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)

class ProductionProgress(models.Model):
    production = models.ForeignKey(ProductionOrder, on_delete=models.CASCADE, null=False)
    last_update = models.DateTimeField(auto_now_add=True)
    daily_produced = models.PositiveIntegerField(default=0, null=False, blank=False)
    produced_tracker = models.PositiveBigIntegerField(default=0, null=False, blank=False)
    isMyEndNear = models.BooleanField(default=False, null=False, blank=False)

@receiver(post_save, sender=ProductionOrder)
def add_prodchine_to_queue(sender, instance, created, **kwargs):
    if created:
        if instance.machine is not None:
            ProductionProgress.objects.create(production=instance)


# @receiver(post_save, sender=ProductionOrder)
# def update_plan_status(sender, instance, created, **kwargs):
#     if created:
#         plan_instance = instance.plan
#         plan = Plan.objects.get(id=plan_instance.id)
#         plan.status = Plan.PlanStatus.APPROVED
#         plan.save()