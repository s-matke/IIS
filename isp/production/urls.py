from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path("production/order/", ProductionOrderAPIViewSet.as_view()),
    path(r"production/order/<str:state>", ProductionOrderRetrieveByStateViewSet.as_view()),
]

router = DefaultRouter()
router.register('production/', ProductionOrderViewSet)
urlpatterns += router.urls