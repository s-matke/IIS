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

import time
import random


# Create your views here.

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.values_list('name', flat = True)[0] in ['Plan Manager', 'Inventory Manager', 'Production Manager']

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.values_list('name', flat = True)[0] == 'Admin'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductAPIViewSet(APIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated & (IsManager | IsAdmin)]


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
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status.HTTP_201_CREATED)

    def put(self, request):
        
        return Response(status=status.HTTP_202_ACCEPTED)

# class ProductRetrieveViewSet(generics.RetrieveAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     permission_classes = [IsAuthenticated, IsManager]

class ProductRUDViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsManager]

    # @transaction.atomic
    def put(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                product_id = kwargs['pk']

                request.data['price_of_producing'] = calculate_production_price(request.data)
                print(request.data)

                # Lock product for update
                product_to_update = Product.objects.select_for_update(nowait=True).filter(id=product_id).get()
                product_serializer = self.get_serializer(product_to_update, data=request.data, partial = False)
                product_serializer.is_valid(raise_exception=True)

                # Update product with new data
                self.perform_update(product_serializer)
                
                # Lock data in BOM with given product ID
                boms_to_update = BillOfMaterial.objects.select_for_update().filter(product=product_id)

                # Extract IDs for material from request
                new_bom_list = [d["id"] for d in request.data['materials'] if "id" in d]

                # Extract IDs for material from existing BOMs in DB
                curr_bom_list = list(boms_to_update.values_list('material', flat=True))

                # Create lists consisting of material IDs that have to be updated, deleted or created
                to_update = [item for item in curr_bom_list if item in set(new_bom_list)]
                to_delete = [item for item in curr_bom_list if item not in set(new_bom_list)]
                to_create = [item for item in new_bom_list if item not in set(curr_bom_list)]

                # Update/Delete BOM with given material IDs
                for bom in boms_to_update:
                    if bom.material.id in to_update:
                        quantity_val = next((item['quantity'] for item in request.data['materials'] if item['id'] == bom.material.id))
                        updated_bom = {
                            "quantity": quantity_val
                        }

                        bom_serializer = BillOfMaterialSerializer(bom, data=updated_bom, partial=True)
                        bom_serializer.is_valid(raise_exception=True)
                        self.perform_update(bom_serializer)
                    elif bom.material.id in to_delete:
                        self.perform_destroy(bom)
                    else:
                        raise "unexpected error occured"
                
                # Create BOMs with given material IDs and quantities
                for i in to_create:
                    quantity_val = next((item['quantity'] for item in request.data['materials'] if item['id'] == i))
                   
                    billOfMaterialDict = {
                        "product": product_id,
                        "material": i,
                        "quantity": quantity_val
                    }

                    bill_of_material_serializer = BillOfMaterialSerializer(data=billOfMaterialDict)

                    if not bill_of_material_serializer.is_valid():
                        return Response(bill_of_material_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    
                    bill_of_material_serializer.save()

                return Response(status=status.HTTP_200_OK)            
        except DatabaseError:
            return Response(status=status.HTTP_423_LOCKED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

def calculate_production_price(data):
    price_of_producing = 0.0
    print(data)
    for material in data['materials']:
        # materials_id.append(material['id'])
        material_price = float(Material.objects.filter(id=material['id']).get().price)
        price_of_producing += float(material_price) * float(material['quantity'])
    
    return price_of_producing