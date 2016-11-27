from __future__ import unicode_literals
import datetime
from django.db import models
from django.contrib.contenttypes.fields import GenericRelation

# Create your models here.
class Label(models.Model):
    name = models.CharField(max_length=500,unique=True)

    def __str__(self):
        return self.name

class Artist(models.Model):
    name = models.CharField(max_length=100)
    label_name = models.ForeignKey(Label,on_delete=models.CASCADE)



    def __str__(self):
        return self.name

class Album(models.Model):
    album_name = models.CharField(max_length=100)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE,default = "def",related_name="rel_albums")
    album_art= models.CharField(max_length = 500,default = "http://vignette4.wikia.nocookie.net/rip-lyl/images/1/13/-%3D.jpg/revision/latest?cb=20130313201437")
    genre = models.CharField(max_length=50)
    album_rating = models.IntegerField(default=0)
    date_created = models.DateField(auto_now_add=True,blank=True)

    def __str__(self):
        return self.album_name

class Song(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE,related_name='tracks')
    song_title = models.CharField(max_length=250)
    song_rating = models.IntegerField(default = 0)
    song_file = models.CharField(max_length=1000,default = "C:\\Users\\")
    def getAlbumName(self):
        return self.Album.album_name

    def __str__(self):
        return self.song_title