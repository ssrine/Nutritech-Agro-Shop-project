from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken  
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.models import User

class HomePageView(APIView):
    def get(self, request):
        data = {"message": "Welcome to Nutritech Agro Shop!"}
        return Response(data, status=status.HTTP_200_OK)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'success': True, 'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            return Response({
                'success': True,
                'message': 'Login successful!',
                'access_token': access_token
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Invalid credentials'
            }, status=status.HTTP_400_BAD_REQUEST)
    


SHOPPING_LISTS = []  

PRODUCTS = [
    {"id": 1, "name": "Organic Fertilizer", "price": 25},
    {"id": 2, "name": "Premium Seeds", "price": 15},
    {"id": 3, "name": "Garden Tools Kit", "price": 50},
    {"id": 4, "name": "Watering Can", "price": 20},
    {"id": 5, "name": "Plant Pots", "price": 10},
    {"id": 6, "name": "Soil Enhancer", "price": 30},
]

class AddToList(APIView):
    def post(self, request, *args, **kwargs):
        product_id = request.data.get("productId")
        quantity = request.data.get("quantity")
        username = request.data.get("username")

        if not product_id or not quantity or not username:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        product = next((p for p in PRODUCTS if p["id"] == int(product_id)), None)

        if not product:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        existing_item = next(
            (item for item in SHOPPING_LISTS if item["product_name"] == product["name"] and item["username"] == username),
            None
        )

        if existing_item:
            existing_item["quantity"] += int(quantity)
            return Response(
                {"message": "Product quantity updated in your shopping list!", "data": existing_item},
                status=status.HTTP_200_OK,
            )

        new_item = {
            "product_name": product["name"],
            "quantity": int(quantity),
            "price": product["price"],
            "username": username,
        }
        SHOPPING_LISTS.append(new_item)

        return Response(
            {"message": "Product added to your shopping list!", "data": new_item},
            status=status.HTTP_201_CREATED,
        )
