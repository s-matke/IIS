from django.db import models
from plan.models import Plan
from account.models import Account
from machine.models import Machine
from django.utils.translation import gettext_lazy as _
# Create your models here.

class ProductionOrder(models.Model):

    class ProductionStatus(models.TextChoices):
        FINISHED = 'FINISHED', _('Finished')        # production finished successfully
        CANCELLED = 'CANCELLED', _('Cancelled')     # aborted production
        ACTIVE = 'ACTIVE', _('Active')              # producing
        PENDING = 'PENDING', _('Pending')           # in queue, waiting for machine

    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, null=False)
    priority = models.PositiveSmallIntegerField(null=False, blank=False)
    manager = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
    added_on = models.DateField(auto_now_add=True)
    machine = models.ForeignKey(Machine, on_delete=models.SET_NULL, null=True)
    state = models.CharField(choices=ProductionStatus.choices, default=ProductionStatus.PENDING)
    # worker = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)

class ProductionOrderQueue(models.Model):
    production = models.ForeignKey(ProductionOrder, on_delete=models.CASCADE, null=False)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, null=False)