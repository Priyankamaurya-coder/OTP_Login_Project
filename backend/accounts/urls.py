from django.urls import path
from .views import (
    send_otp,
    verify_otp,
    register_user,
    recognize_user,
    submit_checkout,
)

urlpatterns = [
    path('send-otp/', send_otp),
    path('verify-otp/', verify_otp),
    path('register/', register_user),
    path('recognize-user/', recognize_user),
    path('submit-checkout/', submit_checkout),
]