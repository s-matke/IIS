from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, generics, status
from rest_framework.permissions import IsAuthenticated
from .models import Product
from rest_framework.response import Response
from .serializers import *

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
        product_serializer = ProductSerializer(data=request.data)

        if not product_serializer.is_valid():
            return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        product_serializer.save()

        return Response(product_serializer.data, status=status.HTTP_201_CREATED)