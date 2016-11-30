from django.contrib import admin
from .models import Artist,Label,Album,Song,User,Listen_Record
# Register your models here.

admin.site.register(Label)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(User)
admin.site.register(Listen_Record)

