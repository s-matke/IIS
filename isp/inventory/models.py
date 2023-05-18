from django.db import models
from material.models import Material
from order.models import Order
from product.models import Product
from django.db.models.signals import post_save, pre_delete, post_delete
from django.dispatch import receiver

# Create your models here.

class MaterialInventory(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, null=False)
    quantity = models.PositiveBigIntegerField(null=False, default=0)
    recent_issued_order = models.DateField(blank=True, null=True)

class ProductInventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False)
    quantity = models.PositiveBigIntegerField(null=False)

@receiver(post_save, sender=Material)
def create_material_inventory(sender, instance, created, **kwargs):
    if created:
        MaterialInventory.objects.create(material=instance)

@receiver(post_save, sender=Order)
def update_recent_issued_order(sender, instance, created, **kwargs):
    if created:
        material = instance.material
        material_inventory = MaterialInventory.objects.get(material=material)
        material_inventory.recent_issued_order = instance.issued_date
        # material_inventory.quantity += instance.ordered_quantity
        material_inventory.save()

# @receiver(pre_delete, sender=Order)
# def update_quantity(sender, instance, using, **kwargs):
#     print(instance.ordered_quantity)
    
@receiver(post_delete, sender=Order)
def update_quantity(sender, instance, using, **kwags):
    material_inventory = MaterialInventory.objects.get(material=instance.material)
    material_inventory.quantity += instance.ordered_quantity
    material_inventory.save()