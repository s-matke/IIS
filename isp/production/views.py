from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, DatabaseError

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

    # def post(self, request):

