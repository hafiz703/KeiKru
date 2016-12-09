from django.contrib import admin
from .models import ArtistRegistered, UserRegistered,Label
# Register your models here.

# admin.site.unregister(ArtistRegistered)
admin.site.unregister(UserRegistered)
# admin.site.unregister(Label)
admin.site.register(ArtistRegistered)
admin.site.register(UserRegistered)
admin.site.register(Label)
