from production.models import ProductionOrder
from plan.models import Plan
from order.cron import time_log
import datetime
from production.helper import find_available_machine
from machine.models import MachineQueue

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
            MachineQueue.objects.create(machine=machine, production=production)



