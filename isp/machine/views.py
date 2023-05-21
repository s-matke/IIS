from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, DatabaseError
# Create your views here.

class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]

class MachineAPIViewSet(APIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

    def get(self, request):
        machines = self.queryset.all()

        machine_serializer = self.serializer_class(machines, many=True)

        return Response(machine_serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        machine_serializer = self.serializer_class(data = request.data)

        if not machine_serializer.is_valid():
            return Response(machine_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        machine_serializer.save()

        return Response(machine_serializer.data, status=status.HTTP_201_CREATED)

class MachineRetrieveUpdateDestroyViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

    def get(self, request, *args, **kwargs):
        machine_id = kwargs['pk']

        machine = Machine.objects.filter(id=machine_id).get()

        machine_serializer = self.serializer_class(machine)

        return Response(machine_serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                pk = kwargs['pk']
                machine_to_update = Machine.objects.select_for_update(nowait=True).filter(id=pk).get()

                machine_serializer = self.get_serializer(machine_to_update, request.data, partial=True)
                machine_serializer.is_valid(raise_exception=True)
                
                self.perform_update(machine_serializer)

                return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

