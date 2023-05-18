from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import *
from rest_framework.response import Response
from .serializers import *
from django.db import transaction, DatabaseError
from product.models import Product
from product.serializers import ProductSerializer
# Create your views here.

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.groups.values_list('name', flat = True)[0] in ['Inventory Manager', 'Plan Manager'])

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.values_list('name', flat = True)[0] in ["Admin"]

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class MaterialAPIViewSet(APIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated & (IsManager | IsAdmin)]

    def get(self, request):
        materials = self.queryset.all()
        material_serializer = self.serializer_class(materials, many=True)
    
        if len(material_serializer.data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(material_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            with transaction.atomic():

                material_serializer = self.serializer_class(data=request.data)

                if not material_serializer.is_valid():
                    return Response(material_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                material_serializer.save()

                return Response(material_serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class BillOfMaterialViewSet(APIView):
    queryset = BillOfMaterial.objects.all()
    serializer_class = BillOfMaterialSerializer

    def get(self, request):
        boms = self.serializer_class(self.queryset.all(), many=True)
        return Response(boms.data, status=status.HTTP_200_OK)
        # return Response(test, status=status.HTTP_302_FOUND)

class MaterialRetrieveUpdateViewSet(generics.RetrieveUpdateAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

    def put(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                material_id = kwargs['pk']

                # Select material for update
                material_for_update = Material.objects.select_for_update(nowait=True).filter(id=material_id).get()

                # Save current price and new price to calculate difference for product's price_of_producing
                old_material_price = material_for_update.price
                new_material_price = request.data['price']

                material_serializer = self.get_serializer(material_for_update, request.data, partial=True)
                material_serializer.is_valid(raise_exception=True)

                # Update material
                self.perform_update(material_serializer)
                
                # Catch all IDs for products which were affected by material price change
                product_ids = BillOfMaterial.objects.filter(material=material_id).values_list('product', flat=True)
                
                # Select products for updating
                products_for_update = Product.objects.select_for_update(nowait=True).filter(id__in = product_ids)
                print("Pre fora")
                # Iterate over products and update their price
                for product in products_for_update:
                    quantity = BillOfMaterial.objects.filter(product=product.id, material=material_id).get().quantity
                    new_price_of_producing = float(product.price_of_producing) - (float(old_material_price) * quantity) + (float(new_material_price) * quantity)
                    print("old price: ", product.price_of_producing)
                    print("new price: ", new_price_of_producing)
                    updated_product = {
                        "price_of_producing": round(new_price_of_producing, 2)
                    }
                    product_serializer = ProductSerializer(product, data=updated_product, partial=True)
                    product_serializer.is_valid(raise_exception=True)
                    # self.perform_update(product_serializer)
                    product_serializer.save()
                
                return Response(status=status.HTTP_200_OK)
        except DatabaseError:
            return Response(status=status.HTTP_423_LOCKED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
class SupplierAPIViewSet(APIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

    def get(self, request):
        suppliers = self.serializer_class(self.queryset.all(), many=True)
        return Response(suppliers.data, status=status.HTTP_200_OK)