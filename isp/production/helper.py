from material.models import *
from machine.models import Machine
from production.models import ProductionOrderQueue
from inventory.models import MaterialInventory
from plan.helper import calculate_total_minutes
from django.db.models import Q

def check_invetory_availability(product, producable_amount):
    print("inv avail")
    # materials = Material.objects.filter(billofmaterial__product_id=product)
    boms = BillOfMaterial.objects.filter(product_id=product)

        
    for bom in boms:
        mat_inv = MaterialInventory.objects.filter(material_id = bom.material).get()

        print("inventory:", mat_inv.quantity)
        print("need: ", producable_amount * bom.quantity)
        if mat_inv.quantity < producable_amount * bom.quantity:
            return False
        

    return True

def check_machine_availability(start_date, end_date):
    return Machine.objects.exclude(id__in=ProductionOrderQueue.objects.values('machine')).count()
# Plan.objects.filter(~Q(id=58), end_date__gte=plan_new.start_date, start_date__lte=plan_new.end_date).exists()
