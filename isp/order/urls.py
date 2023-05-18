from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderAPIViewSet, OrderDViewSet

urlpatterns = [
    path('orders/', OrderAPIViewSet.as_view()),
    path(r'order/<int:pk>', OrderDViewSet.as_view())
]

router = DefaultRouter()
router.register('order/', OrderViewSet)
urlpatterns += router.urls