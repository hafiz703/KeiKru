from django.contrib import admin
from .models import Artist,Label,Album,Song
# Register your models here.

admin.site.register(Label)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Song)

