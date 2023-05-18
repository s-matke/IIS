from django.db import models
from product.models import Product

# class Plan(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False)
#     start_date = models.DateTimeField(null=False)
#     end_date = models.DateTimeField(null=False)
#     aprox_producable = models.PositiveIntegerField(null=False)
#     price = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    