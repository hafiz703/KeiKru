from django.contrib import admin
from .models import Album,User,Listen_Record,UserRatedSongs,Song
# Register your models here.

# admin.site.register(Label)
# admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(User)
admin.site.register(Listen_Record)
admin.site.register(UserRatedSongs)

