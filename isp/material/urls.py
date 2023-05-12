from django.urls import path
from .views import MaterialViewSet, MaterialAPIViewSet, BillOfMaterialViewSet, MaterialRetrieveUpdateViewSet
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('material/', MaterialAPIViewSet.as_view()),
    path('bom/', BillOfMaterialViewSet.as_view()),
    path(r'material/<int:pk>', MaterialRetrieveUpdateViewSet.as_view())
]

router = DefaultRouter()
router.register('material/', MaterialViewSet)
urlpatterns += router.urls