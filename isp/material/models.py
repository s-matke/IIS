from django.db import models
from product.models import Product
# Create your models here.

class Material(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False)
    description = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    supplier = models.CharField(max_length=70, null=True, blank=True)
    created = models.DateField(auto_now_add=True)
    min_amount = models.PositiveIntegerField(blank=False, default=0, null=False)
    max_amount = models.PositiveIntegerField(blank=False, default=1, null=False)

class BillOfMaterial(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(blank=True, default=0)

    class Meta:
        unique_together = ('product', 'material')
