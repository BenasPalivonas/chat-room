from django.contrib import admin
from .models import Chat, Room

admin.site.register(Room)
admin.site.register(Chat)