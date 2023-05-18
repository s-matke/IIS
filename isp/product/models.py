from django.db import models
from django.utils.translation import gettext_lazy as _
from account.models import Account

class Product(models.Model):
    
    class ProductStatus(models.TextChoices):
        IN_PRODUCTION = 'IP', _('In Production')
        OUT_OF_PRODUCTION = 'OP', _('Out Of Production')


    name = models.CharField(max_length=30, null=False, blank=False)
    created = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=5, choices=ProductStatus.choices, default=ProductStatus.IN_PRODUCTION)
    lead_time = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_of_producing = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    planner = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True)
