from django.shortcuts import render
from rest_framework import viewsets, status, generics
from .models import Plan
from .serializers import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, DatabaseError
from .helper import calculate_producable_amount_and_cost
import datetime
from product.models import Product
# Create your views here.

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer

class PlanAPIViewSet(APIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer

    def get(self, request):
        plans = self.queryset.all()
        plan_serializer = self.serializer_class(plans, many=True)

        if len(plan_serializer.data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(plan_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            with transaction.atomic():

                start_date = datetime.datetime.strptime(request.data['start_date'], "%Y-%m-%d %H:%M:%S")
                end_date = datetime.datetime.strptime(request.data['end_date'], "%Y-%m-%d %H:%M:%S")
                product = Product.objects.filter(id = request.data['product']).get()
                
                producable_amount, production_cost = calculate_producable_amount_and_cost(start_date, end_date, product)

                if producable_amount is None or production_cost is None:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                request.data['producable_amount'] = producable_amount
                request.data['production_cost'] = production_cost

                plan_serializer = self.serializer_class(data=request.data)
                
                if not plan_serializer.is_valid():
                    return Response(plan_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                plan_serializer.save()

                return Response(plan_serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    