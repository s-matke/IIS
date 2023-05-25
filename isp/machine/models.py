from django.db import models

# Create your models here.
class Machine(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False)
    version = models.CharField(max_length=20, null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    health = models.DecimalField(max_digits=4, decimal_places=1, null=False, blank=False, default=100.0)
    produced_amount = models.PositiveBigIntegerField(null=False, blank=False, default=0)
    last_diagnosis = models.DateField(null=True, blank=True)
    purchase_date = models.DateField(auto_now_add=True)