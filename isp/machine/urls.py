from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('machine/', MachineAPIViewSet.as_view()),
    path(r'machine/<int:pk>', MachineRetrieveUpdateDestroyViewSet.as_view())
]

router = DefaultRouter()
router.register('machine/', MachineViewSet)
urlpatterns += router.urls