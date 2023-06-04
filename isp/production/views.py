from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, DatabaseError
from .helper import *
from .report import create_pdf
from django.http import HttpResponse

# Create your views here.
class ProductionOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer
    permission_classes = [IsAuthenticated]

class ProductionOrderAPIViewSet(APIView):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer

    def get(self, request):
        production_orders = self.queryset.all().order_by("state")

        production_serializer = DetailedProductionOrderSerializer(production_orders, many=True)

        return Response(production_serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            with transaction.atomic():
                plan = Plan.objects.filter(id=request.data['plan']).get()
                if not check_invetory_availability(plan.product, plan.producable_amount):
                    return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
                
                available_machine = find_available_machine(plan.start_date, plan.end_date, plan.id)

                if available_machine:
                    request.data['machine'] = available_machine.id
                
                production_serializer = self.serializer_class(data=request.data)                

                if not production_serializer.is_valid():
                    return Response(production_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                production_serializer.save()

                return Response(production_serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
class ProductionOrderRetrieveByStateViewSet(generics.RetrieveAPIView):
    queryset = ProductionOrder.objects.all()
    serializer_class = DetailedProductionOrderSerializer

    def get(self, request, *args, **kwargs):
        production_state = kwargs['state']

        production_orders = ProductionOrder.objects.filter(state=production_state)

        production_serializer = self.serializer_class(production_orders, many=True)

        return Response(production_serializer.data, status=status.HTTP_200_OK)

class ProductionCancelUpdateViewSet(generics.UpdateAPIView):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer

    def put(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                production_id = kwargs['pk']

                production_to_cancel = ProductionOrder.objects.select_for_update(nowait=True).filter(id=production_id).get()

                changed_data = {
                    'state': ProductionOrder.ProductionStatus.CANCELLED
                }

                production_serializer = self.get_serializer(production_to_cancel, changed_data, partial = True)
                production_serializer.is_valid(raise_exception = True)
                self.perform_update(production_serializer)
                
                return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ProductionProgressRetrieveiewSet(generics.RetrieveAPIView):
    queryset = ProductionProgress.objects.all()
    serializer_class = ProductionProgressSerializer

    def get(self, request, *args, **kwargs):

        productions_progress = ProductionProgress.objects.filter(production__state = 'ACTIVE')

        progress_serializer = self.serializer_class(productions_progress, many=True)

        return Response(progress_serializer.data, status=status.HTTP_200_OK)

class ProductionReportRetrieveViewSet(generics.RetrieveAPIView):
    queryset = ProductionProgress.objects.all()
    serializer_class = ProductionProgressSerializer

    def get(self, request, *args, **kwargs):
        print("PK: ", kwargs['pk'])

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="production_report.pdf"'

        pdf_data = create_pdf(response, kwargs['pk'])
        return response
        # return FileResponse(pdf_data, as_attachment=True, filename='production_report.pdf')
        # response = Response(pdf_data, content_type='application/pdf', status=status.HTTP_200_OK)
        # response['Content-Disposition'] = 'attachment; filename="production_report.pdf"'

        # return response