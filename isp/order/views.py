from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, status, generics
from .models import Order
from material.models import Material
from inventory.models import MaterialInventory
from .serializers import OrderSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import transaction, DatabaseError


# Create your views here.
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderAPIViewSet(APIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = self.queryset.all()
        order_serializer = self.serializer_class(orders, many=True)

        if len(order_serializer.data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(order_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            with transaction.atomic():
                material_id = request.data['material']
                requested_quantity = int(request.data['ordered_quantity'])

                material = Material.objects.filter(id=material_id).get()
                materialInventory = MaterialInventory.objects.filter(material_id=material_id).get()

                if requested_quantity + materialInventory.quantity > material.max_amount:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                order_serializer = self.serializer_class(data=request.data)

                if not order_serializer.is_valid():
                    return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                order_serializer.save()
                
                return Response(order_serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class OrderDViewSet(generics.DestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    # def delete(self, request):
