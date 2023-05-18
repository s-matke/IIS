from django.db import models
from material.models import Material, Supplier
from account.models import Account
# Create your models here.

class Order(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, null=False)
    ordered_by = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
    issued_date = models.DateField(auto_now_add=True)
    expected_delivery_date = models.DateField()
    ordered_quantity = models.PositiveBigIntegerField(null=False)