from django.urls import path
from .views import ProductViewSet, ProductAPIViewSet
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('product/', ProductAPIViewSet.as_view()),
]

router = DefaultRouter()
router.register('product/', ProductViewSet)
urlpatterns += router.urls