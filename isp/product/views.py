from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, generics, status
from rest_framework.permissions import IsAuthenticated
from .models import Product
from material.models import Material
from material.serializers import BillOfMaterialSerializer
from rest_framework.response import Response
from .serializers import *
from django.db import transaction, DatabaseError
from django.db.models import Sum


# Create your views here.

class IsPlanner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.values_list('name', flat = True)[0] == 'Plan Manager'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductAPIViewSet(APIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsPlanner]

    def get(self, request):
        products = self.queryset.all()
        product_serializer = self.serializer_class(products, many=True)
    
        if len(product_serializer.data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(product_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):        
        try:
            with transaction.atomic():
                request.data['price_of_producing'] = calculate_production_price(request.data)

                product_serializer = ProductSerializer(data=request.data)
                if not product_serializer.is_valid():
                    return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                product_serializer.save()
                product_id = product_serializer.data['id']

                for material in request.data['materials']:    
                    billOfMaterialDict = {
                        "product": product_id,
                        "material": material['id'],
                        "quantity": material['quantity']
                    }
                    bill_of_material_serializer = BillOfMaterialSerializer(data=billOfMaterialDict)

                    if not bill_of_material_serializer.is_valid():
                        return Response(bill_of_material_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    
                    bill_of_material_serializer.save()
        except DatabaseError:
            return Response(status=status.HTTP_409_CONFLICT)
        
        return Response(status=status.HTTP_201_CREATED)

def calculate_production_price(data):
    materials_id = []
    for material in data['materials']:
        materials_id.append(material['id'])
    
    production_price = Material.objects.filter(id__in=materials_id).aggregate(Sum('price'))
    return production_price['price__sum']