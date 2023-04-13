from django.urls import path, include
from .views import TestViewSet, ListTestViewSet, ListAccountViewSet, ListUserViewSet, RegisterUserViewSet
from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('test/', ListTestViewSet.as_view()),
    path('accounts/', ListAccountViewSet.as_view()),
    path('users/', ListUserViewSet.as_view()),
    path('signup/', RegisterUserViewSet.as_view()),
    path('signin/', TokenObtainPairView.as_view(), name='token_obtain_pair')
]

router = DefaultRouter()
router.register('', TestViewSet)
urlpatterns += router.urls