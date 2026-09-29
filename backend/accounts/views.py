import random
from datetime import timedelta

from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import OTP, User, Checkout


@api_view(['POST'])
def send_otp(request):
    phone_number = request.data.get('phone_number')

    if not phone_number:
        return Response(
            {"error": "Phone number is required"},
            status=400
        )

    if not phone_number.isdigit() or len(phone_number) != 10:
        return Response(
            {"error": "Enter a valid 10-digit phone number"},
            status=400
        )

    otp = str(random.randint(100000, 999999))

    OTP.objects.create(
        phone_number=phone_number,
        otp=otp
    )

    return Response({
        "message": "OTP generated successfully",
        "otp": otp
    })


@api_view(['POST'])
def verify_otp(request):
    phone_number = request.data.get('phone_number')
    otp = request.data.get('otp')

    if not phone_number or not otp:
        return Response(
            {"error": "Phone number and OTP are required"},
            status=400
        )

    if not otp.isdigit() or len(otp) != 6:
        return Response(
            {"error": "OTP must be exactly 6 digits"},
            status=400
        )

    otp_record = OTP.objects.filter(
        phone_number=phone_number,
        otp=otp
    ).last()

    if not otp_record:
        return Response(
            {"error": "Invalid OTP"},
            status=400
        )

    if timezone.now() - otp_record.created_at > timedelta(minutes=5):
        return Response(
            {"error": "OTP has expired"},
            status=400
        )

    otp_record.delete()

    return Response({
        "message": "OTP verified successfully"
    })


@api_view(['POST'])
def register_user(request):
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')

    if not email or not first_name or not last_name:
        return Response(
            {"error": "Email, first name and last name are required"},
            status=400
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "User already registered"},
            status=400
        )

    user = User.objects.create(
        email=email,
        first_name=first_name,
        last_name=last_name
    )

    otp = str(random.randint(100000, 999999))

    OTP.objects.create(
        phone_number=email,
        otp=otp
    )

    return Response({
        "message": "Registration successful",
        "otp": otp,
        "user": {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    })


@api_view(['POST'])
def recognize_user(request):
    email = request.data.get('email')

    if not email:
        return Response(
            {"error": "Email is required"},
            status=400
        )

    try:
        user = User.objects.get(email=email)

        return Response({
            "registered": True,
            "user": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        })

    except User.DoesNotExist:
        return Response({
            "registered": False
        })


@api_view(['POST'])
def submit_checkout(request):
    email = request.data.get('email')
    phone_number = request.data.get('phone_number')
    shipping_address = request.data.get('shipping_address')

    if not email or not phone_number or not shipping_address:
        return Response(
            {"error": "Email, phone number and shipping address are required"},
            status=400
        )

    checkout = Checkout.objects.create(
        email=email,
        phone_number=phone_number,
        shipping_address=shipping_address
    )

    return Response({
        "message": "Checkout information submitted successfully",
        "checkout": {
            "email": checkout.email,
            "phone_number": checkout.phone_number,
            "shipping_address": checkout.shipping_address
        }
    })