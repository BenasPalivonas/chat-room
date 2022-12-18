from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods

import json


from .models import Chat, Room, User
from .serializers import ChatSerializer

# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def create_room(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            Room.objects.get(name = data['name'], password = data['password'])
            return JsonResponse({"status": 404})
        except RuntimeError:
            Room.objects.create(name = data['name'], password = data['password'])
            return JsonResponse({"status": 200})

@api_view(['GET', 'POST', 'DELETE'])
@require_http_methods(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def room(request, name, password):
    if request.method == "GET":
        room = Room.objects.get(name=name, password=password)
        messages = reversed(room.room.all())
        serializer = ChatSerializer(messages, many=True)
        return Response(serializer.data)

    if request.method == "DELETE":
        room = Room.objects.get(name=name, password=password)
        room.delete()

    if request.method == "POST":
        print(request.POST, request.data, sep="\n")
        room = Room.objects.get(name=name, password=password)
        user = request.user
        try:
            message = request.data.get('message')
        except RuntimeError:
            message = ""
        try:
            image = request.data.get('image')
            print(image)
            if image == "undefined":
                image = None
        except RuntimeError:
            image = None
        chat = Chat.objects.create(user=user, room=room, message=message, image=image)
        chat.save()
        return JsonResponse({"status": "201"})

@api_view(['POST'])
@require_http_methods(["POST"])
def create_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data['username']
        password = data['password']
        try:
            User.objects.get(username=username)
            return JsonResponse({"status": "405", "ok": False})
        except RuntimeError:
            User.objects.create_user(username=username, password=password).save()
            return JsonResponse({"status": "200", "ok": True})

@api_view(['POST'])
@require_http_methods(["POST"])
def delete_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        username = data['username']
        user = User.objects.get(username=username,)
        print(user)
        user.delete()
