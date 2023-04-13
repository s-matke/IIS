from account.models import Test, Account
from account.serializers import TestSerializer, AccountSerializer, UserSerializer, UserRegisterSerializer, UserSerializerNew
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User, Group, AnonymousUser
from rest_framework.views import APIView


# Create your views here.

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class ListTestViewSet(generics.ListAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    def list(self, request):
        queryset = Test.objects.all()
        serialized_tests = TestSerializer(instance=queryset, many = True)
        return Response(serialized_tests.data)

class ListAccountViewSet(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = AccountSerializer

    def list(self, request):
        queryset = Account.objects.all()
        serialized_accounts = AccountSerializer(instance=queryset, many=True)
        return Response(serialized_accounts.data)

class ListUserViewSet(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        queryset = User.objects.all()
        serialized_users = UserSerializer(instance=queryset, many=True)
        return Response(serialized_users.data)
    

class CurrentUserView(APIView):
    def get(self, request):
        if isinstance(request.user, AnonymousUser) == True:
            return Response(status=404)
        else:
            serializer = UserSerializerNew(request.user)
            return Response(serializer.data)


class RegisterUserViewSet(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # def register(self, request):
    #     print(request)
    #     return Response("yo")
    def post(self, request):
        return post_new_user(request, Group.objects.get(name="User"), True, False, True)


def post_new_user(request, group, is_active, is_superuser, is_staff):
    user_serializer = UserRegisterSerializer(data=request.data)
    account_serializer = AccountSerializer(data=request.data)

    if not user_serializer.is_valid() or not account_serializer.is_valid():
        return Response(user_serializer.errors if not user_serializer.is_valid() else account_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    instance = user_serializer.save()
    instance.groups.add(group)
    instance.is_superuser = is_superuser
    instance.is_staff = is_staff
    instance.is_active = is_active
    instance.save()

    account_serializer.instance = instance.account
    account_serializer.save()
    return Response(account_serializer.data, status=status.HTTP_201_CREATED)

