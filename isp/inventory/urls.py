from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('inventory/products', ProductInventoryAPIViewSet.as_view()),
    path('inventory/materials', MaterialInventoryAPIViewSet.as_view())
]

router = DefaultRouter()
router.register('inventory/', InventoryViewSet)
urlpatterns += router.urls