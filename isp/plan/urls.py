from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('plan/', PlanAPIViewSet.as_view()),
    path(r'plan/planner/<int:planner>', PlanRetrieveDestroyViewSet.as_view()),
    path(r'plan/<int:pk>', PlanRetrieveDestroyViewSet.as_view()),
    path(r'plan/<int:pk>/<str:status>', PlanRetrieveByStatusViewSet.as_view()),
    path(r'plan/<str:status>', PlanRetrieveByStatusViewSet.as_view())
]

router = DefaultRouter()
router.register('plan/', PlanViewSet)
urlpatterns += router.urls