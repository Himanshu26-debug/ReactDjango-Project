from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Product, Category, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializers, CategorySerializer, CartSerializers, CartItemSerializers, RegisterSerializer, UserSerializers

# Create your views here.
@api_view(["GET"])
def get_products(request):
    products = Product.objects.all()
    serializers = ProductSerializers(products, many = True)
    return Response(serializers.data)

@api_view(["GET"])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializers = ProductSerializers(product, context = {'request':request})
        return Response(serializers.data)
    except Product.DoesNotExist:
        return Response({"error": "Product not Found"}, status=404)

@api_view(["GET"])
def get_categories(request):
    categories = Category.objects.all()
    serializers = CategorySerializer(categories, many = True)
    return Response(serializers.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    print("USER:", request.user)
    print("AUTH:", request.auth)
    serializer = CartSerializers(cart)
    return Response (serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_cart(request):
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity +=1
        item.save()
    
    return Response({'message': 'Product Added to Cart', "Cart": CartSerializers(cart).data})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')
    if not item_id or quantity is None:
        return Response({"error": "Item Id and quantity are required"}, status=400)
    
    try:
        item = CartItem.objects.get(id=item_id)
        if int(quantity) < 1:
            item.delete()
            return Response({"error": "Quantity must be alteast 1"}, status=400)
        
        item.quantity = quantity
        item.save()
        serializers = CartItemSerializers(item)
        return Response(serializers.data)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({"message": "Item Removed from cart"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
        try:
            data = request.data
            name= data.get('name')
            address = data.get('address')
            phone = data.get('phone')
            payment_method = data.get('payment_method', 'COD')

            if not phone.isdigit() or len(phone) < 10:
                return Response({'erorr': 'Invalid Phone Number'}, status=400)
        
            cart, created = Cart.objects.get_or_create(user = request.user)
            if not cart.items.exists():
                return Response({"error": "cart is empty"}, status=400)

            total = sum([item.product.price* item.quantity for item in cart.items.all()])

            order = Order.objects.create(user=request.user, total_amount = total)

                # Create order item
            for item in cart.items.all():
                OrderItem.objects.create(
                    order = order,
                    product = item.product,
                    quantity = item.quantity,
                    price = item.product.price,
                )
                # clear the cart
                cart.items.all().delete()
                return Response({
                    'message': 'Order Placed Successfully',
                    'order_id': order.id
                })
        except Exception as e:
                 return Response({'error': str(e)}, status=500) 

@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializers = RegisterSerializer(data=request.data)
    if serializers.is_valid():
        user = serializers.save()
        user_serializers = UserSerializers(user)
        return Response({"messaage": "User created successfully", "user": UserSerializers(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


