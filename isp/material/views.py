from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, generics, status
from rest_framework.permissions import IsAuthenticated
from .models import Material
from rest_framework.response import Response
from .serializers import *

# Create your views here.

class IsPlanner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.values_list('name', flat = True)[0] == 'Plan Manager'

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class MaterialAPIViewSet(APIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated, IsPlanner]

    def get(self, request):
        materials = self.queryset.all()
        material_serializer = self.serializer_class(materials, many=True)
    
        if len(material_serializer.data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(material_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        material_serializer = self.serializer_class(data=request.data)

        if not material_serializer.is_valid():
            return Response(material_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        material_serializer.save()

        return Response(material_serializer.data, status=status.HTTP_201_CREATED)