from .models import Test, Account
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)
        account = Account.objects.get(user__id=self.user.id)
        
        refresh['user_id'] = account.id
        refresh['groups'] = list(self.user.groups.values_list('name', flat=True))
        refresh['user_name'] = account.user.get_full_name()

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        return data


class TestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'name', 'numer']

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'address', 'city', 'country', 'phone', 'user_id', 'salary']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'account', 'groups']

class UserSerializerNew(serializers.ModelSerializer):
    account = AccountSerializer(read_only = True)
    groups = serializers.SlugRelatedField(
        many = True,
        read_only = True,
        slug_field='name'
    )

    class Meta:
        model = User
        read_only_fields = ['email']
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'account', 'groups']

class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required = True,
        validators = [UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only = True,
        required = True,
        validators = [validate_password]
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['email'],
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        return user