from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('plan/', PlanAPIViewSet.as_view())
]

router = DefaultRouter()
router.register('plan/', PlanViewSet)
urlpatterns += router.urls