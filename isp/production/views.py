from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, DatabaseError
from .helper import *
from machine.models import MachineQueue

# Create your views here.
class ProductionOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer
    permission_classes = [IsAuthenticated]

class ProductionOrderAPIViewSet(APIView):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer

    def get(self, request):
        production_orders = self.queryset.all().order_by("state")

        production_serializer = DetailedProductionOrderSerializer(production_orders, many=True)

        return Response(production_serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            with transaction.atomic():
                plan = Plan.objects.filter(id=request.data['plan']).get()
                if not check_invetory_availability(plan.product, plan.producable_amount):
                    return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
                
                available_machine = find_available_machine(plan.start_date, plan.end_date, plan.id)

                if available_machine:
                    request.data['machine'] = available_machine.id
                
                production_serializer = self.serializer_class(data=request.data)                

                if not production_serializer.is_valid():
                    return Response(production_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                production_serializer.save()

                return Response(production_serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
class ProductionOrderRetrieveByStateViewSet(generics.RetrieveAPIView):
    queryset = ProductionOrder.objects.all()
    serializer_class = DetailedProductionOrderSerializer

    def get(self, request, *args, **kwargs):
        production_state = kwargs['state']

        production_orders = ProductionOrder.objects.filter(state=production_state)

        production_serializer = self.serializer_class(production_orders, many=True)

        return Response(production_serializer.data, status=status.HTTP_200_OK)