from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, DatabaseError
from .helper import *

# Create your views here.
class ProductionOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer
    permission_classes = [IsAuthenticated]

class ProductionOrderAPIViewSet(APIView):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer

    def get(self, request):
        production_orders = self.queryset.all()

        production_serializer = self.serializer_class(production_orders, many=True)

        return Response(production_serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            with transaction.atomic():
                plan = Plan.objects.filter(id=request.data['plan']).get()
                if not check_invetory_availability(plan.product, plan.producable_amount):
                    return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
                
                if not check_machine_availability(plan.start_date, plan.end_date):
                    pass
                return Response(status=status.HTTP_200_OK)
        except:
            print("Uff")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # try:
        #     with transaction.atomic():
        #         print(request)
        #         pass
        # except:
        #     pass
        # pass

    # def post(self, request):

