from django.urls import path
from .views import ProductRUDViewSet, ProductViewSet, ProductAPIViewSet
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('product/', ProductAPIViewSet.as_view()),
    # path(r'product/<int:pk>', ProductRetrieveViewSet.as_view()),
    path(r'product/<int:pk>', ProductRUDViewSet.as_view())
]

router = DefaultRouter()
router.register('product/', ProductViewSet)
urlpatterns += router.urls