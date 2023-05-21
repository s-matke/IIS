from django.db import models
from plan.models import Plan
from account.models import Account
# Create your models here.

class ProductionOrder(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, null=False)
    priority = models.PositiveSmallIntegerField(null=False, blank=False)
    manager = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
    added_on = models.DateField(auto_now_add=True)
    # machine
    # worker?
    # 

# class ProductionOrderQueue(models.Model):