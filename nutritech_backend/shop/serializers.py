from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}  # Ensures password is not returned in responses
        }

    def create(self, validated_data):
        # Create a user using the validated data (password will be hashed)
        return User.objects.create_user(**validated_data)
