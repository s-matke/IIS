from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import *
from .serializers import *
from rest_framework.views import APIView


# Create your views here.
class InventoryViewSet(viewsets.ModelViewSet):
    queryset = ProductInventory.objects.all()
    serializer_class = ProductInventorySerializer

class ProductInventoryAPIViewSet(APIView):
    queryset = ProductInventory.objects.all()
    serializer_class = ProductInventorySerializer

    def get(self, request):
        products = self.queryset.all()
        product_serializer = self.serializer_class(products, many=True)

        if len(product_serializer.data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(product_serializer.data, status=status.HTTP_200_OK)

class MaterialInventoryAPIViewSet(APIView):
    queryset = MaterialInventory.objects.all()
    serializer_class = MaterialInventorySerializer

    def get(self, request):
        materials = self.queryset.all().order_by('recent_issued_order')
        material_serializer = self.serializer_class(materials, many=True)

        if len(material_serializer.data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(material_serializer.data, status=status.HTTP_200_OK)