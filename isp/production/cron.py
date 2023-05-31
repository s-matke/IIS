from production.models import ProductionOrder, ProductionProgress
from plan.models import Plan
from material.models import BillOfMaterial
from inventory.models import *
from machine.models import Machine
from order.cron import time_log
import datetime
from production.helper import find_available_machine
from django.utils import timezone
from django.db import transaction, DatabaseError
from django.db.models import F
from django.conf import settings
import pytz

def check_pending_productions():
    affected_rows = ProductionOrder.objects.filter(state = ProductionOrder.ProductionStatus.PENDING, 
                                   machine__isnull=False, 
                                   plan__in = Plan.objects.filter(status=Plan.PlanStatus.APPROVED, 
                                                                  start_date__lte = datetime.datetime.now()).values_list('id', flat=True)) \
                            .update(state=ProductionOrder.ProductionStatus.ACTIVE)
    if affected_rows:
        print(time_log() + " Updated: " + str(affected_rows) + " rows of ProductionOrder to state: " + str(ProductionOrder.ProductionStatus.ACTIVE))
    


def check_machine_availability():
    machineless_productions = ProductionOrder.objects.filter(machine__isnull=True).order_by('-priority')
    for production in machineless_productions:
        machine = find_available_machine(production.plan.start_date, production.plan.end_date, production.plan.id)

        if machine:
            print(time_log() + " Adding machine(id = " + str(machine.id) + ")  to production: " + str(production.id))
            ProductionOrder.objects.filter(id=production.id).update(machine=machine.id)
            ProductionProgress.objects.create(production=production)
        
def check_production_ending():
    try:
        with transaction.atomic():
            tz = pytz.timezone(settings.TIME_ZONE)
            current_datetime = tz.localize(datetime.datetime.now())

            updated_count = ProductionOrder.objects.filter(plan__end_date__lte = current_datetime, state = ProductionOrder.ProductionStatus.ACTIVE).update(state = ProductionOrder.ProductionStatus.FINISHED)
            if updated_count:
                print(time_log() + " [INFO] Updated " + str(updated_count) + " productions from ACTIVE to FINISHED state")
                # TODO: obrisati raise
                raise 'preserve'
    except:
        print(time_log() + " [ERROR] Something went wrong updating productions")


def reset_daily_produced_amount():
    try:
        with transaction.atomic():
            ProductionProgress.objects.filter(daily_produced__gt = 0).update(daily_produced = 0)            
    except:
        print(time_log() + " [ERROR] Something went wrong resetting daily produced amount!") 

def check_production_progress():
    active_productions = ProductionProgress.objects.filter(production_id__in=ProductionOrder.objects.filter(state=ProductionOrder.ProductionStatus.ACTIVE).values_list('id', flat=True))
    # alternativa:
    # active_productions = ProductionProgress.objects.filter(production__state = 'ACTIVE').values_list('id', flat=True))
    if datetime.datetime.now().hour >= settings.PRODUCTION_OPENING_TIME.hour and datetime.datetime.now().hour < settings.PRODUCTION_CLOSING_TIME.hour:
        for active_production in active_productions:
            lead_time = float(active_production.production.plan.product.lead_time)
            
            if active_production.last_update + timezone.timedelta(minutes=lead_time) <= timezone.now():
                try:
                    with transaction.atomic():
                        product_id = active_production.production.plan.product.id
                        product_obj = active_production.production.plan.product
                        boms = BillOfMaterial.objects.filter(product = product_id)
                        # materials_inventory_to_update = MaterialInventory.objects.select_for_update(nowait=True).filter(material__in = boms.values_list('material_id', flat=True))

                        for bom in boms:
                            previous_amount = MaterialInventory.objects.filter(material = bom.material).get().quantity
                            if MaterialInventory.objects.filter(material_id = bom.material).update(quantity = F('quantity') - bom.quantity):
                                print(time_log() + " [INFO] Material ID: " + str(bom.material.id) + " removed " + str(bom.quantity) + " from inventory (" + str(previous_amount) + " -> " + str(previous_amount - bom.quantity) + ")")

                        if not ProductInventory.objects.filter(product = product_id):
                            ProductInventory.objects.create(product = product_obj)
                            print(time_log() + " [INFO] Updated ProductInventory for Product ID: " + str(product_id))
                        
                        previous_amount = ProductInventory.objects.filter(product=product_id).get().quantity
                        if ProductInventory.objects.filter(product = product_id).update(quantity = F('quantity') + 1):
                            print(time_log() + " [INFO] Product ID: " + str(product_id) + " added 1 into the inventory (" + str(previous_amount) + " -> " + str(previous_amount + 1) + ")")
                        
                        if Machine.objects.filter(id = active_production.production.machine.id).update(produced_amount = F('produced_amount') + 1):
                            print(time_log() + " [INFO] Machine ID: " + str(active_production.production.machine.id) + " added +1 to `produced_amount`")

                        if ProductionProgress.objects.filter(production = active_production.production).update(daily_produced = F('daily_produced') + 1, 
                                                                                                produced_tracker = F('produced_tracker') + 1, 
                                                                                                last_update = timezone.now()):
                            print(time_log() + " [INFO] Production Progress ID: " + str(active_production.id))
                            print()
                except:
                    print(time_log() + " [ERROR] Something went wrong updating inventory or production progress")




