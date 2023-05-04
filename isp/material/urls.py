from django.urls import path
from .views import MaterialViewSet, MaterialAPIViewSet
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('material/', MaterialAPIViewSet.as_view()),
]

router = DefaultRouter()
router.register('material/', MaterialViewSet)
urlpatterns += router.urls