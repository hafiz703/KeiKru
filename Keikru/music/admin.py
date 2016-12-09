from django.contrib import admin
from .models import ArtistRegistered, UserRegistered
# Register your models here.

admin.site.register(ArtistRegistered)
admin.site.register(UserRegistered)
