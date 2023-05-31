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

# class MachineQueue(models.Model):
#     machine = models.ForeignKey(Machine, on_delete=models.CASCADE, null=False)
#     production = models.ForeignKey('production.ProductionOrder', on_delete=models.CASCADE, null=False)
#     last_update = models.DateTimeField(auto_now_add=True)
#     daily_produced = models.PositiveIntegerField(default=0, null=False, blank=False)
#     produced_tracker = models.PositiveBigIntegerField(default=0, null=False, blank=False)
#     isMyEndNear = models.BooleanField(default=False, null=False, blank=False)

#     class Meta:
#         unique_together = ('machine', 'production')

# @receiver(post_save, sender='production.ProductionOrder')
# def add_prodchine_to_queue(sender, instance, created, **kwargs):
#     if created:
#         if instance.machine is not None:
#             MachineQueue.objects.create(machine=instance.machine, production=instance)

