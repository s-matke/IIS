from material.models import *
from machine.models import Machine
from production.models import ProductionOrder
from plan.models import Plan
from inventory.models import MaterialInventory
from plan.helper import calculate_total_minutes
from django.db.models import Q

def check_invetory_availability(product, producable_amount):
    # materials = Material.objects.filter(billofmaterial__product_id=product)
    boms = BillOfMaterial.objects.filter(product_id=product)

        
    for bom in boms:
        mat_inv = MaterialInventory.objects.filter(material_id = bom.material).get()
        
        if mat_inv.quantity < producable_amount * bom.quantity:
            return False
        
    return True


# pronaci sve planove ciji se start_date i end_date preklapaju sa prosledjenim
# potom povuci sve masine koje postoje a da ne rade na ProductionOrder za prethodno
# pronadjene planove. ako postoji masina -> dodeliti je novom production_orderu
# u suprotnom postaviti na null masinu kako bi cron tech moglo proveravati 
# kome fali masina
def find_available_machine(start_date, end_date, plan_id):
    plans_ids = Plan.objects.filter(~Q(id=plan_id), end_date__gte=start_date, start_date__lte=end_date, status=Plan.PlanStatus.APPROVED).values_list('id', flat=True)

    available_machines = Machine.objects.exclude(id__in=ProductionOrder.objects.filter(plan__in=plans_ids, machine__isnull=False, state__in=[ProductionOrder.ProductionStatus.ACTIVE, ProductionOrder.ProductionStatus.PENDING]).values('machine')).order_by('-release_date')

    if available_machines:
        return available_machines[0]
    else:
        return None

    # return Machine.objects.exclude(id__in=ProductionOrderQueue.objects.values('machine')).count()
#Machine.objects.exclude(id__in=ProductionOrder.objects.filter(plan__in=arr, machine__isnull=False).values('machine'))