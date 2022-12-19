from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import MyTokenObtainPairView, create_room, room, create_user, delete_user


urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('room/', create_room, name="createRoom"),
    path('room/<str:name>/<str:password>', room, name="room"),
    path('user/create', create_user, name="createUser"),
    path('user/delete', delete_user, name="deleteUser"),
]
