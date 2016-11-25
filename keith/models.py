from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Album(models.Model):
	#id is given auto
    name = models.CharField(max_length=250)
    genre = models.CharField(max_length=250) #list of genres to chose from?
    artiste = models.ForeignKey(Artiste, on_delete=models.CASCADE)
    
    #album_logo = models.CharField(max_length=1000)

    def __str__(self):
        return self.album_title + ' - ' + self.artist

RATING = ((1,1),(2,2),(3,3),(4,4),(5,5))
class Song(models.Model):
	#id is given auto
	name = models.CharField(max_length=250)
    rating = models.IntegerField(max_length=1,choices=RATING) #check that its from 1-5? can remove if not needed
    song_file = models.CharField(max_length=10) 
    album = models.ForeignKey(Album, on_delete=models.CASCADE)

class Artiste(models.Model):
	#id is given auto
    name = models.CharField(max_length=250)
    label = models.ForeignKey(Label, on_delete=models.CASCADE)

class Label(models.Model):
	#id is given auto
    name = models.CharField(max_length=250)

class User(models.Model):
	#id is given auto
    name = models.CharField(max_length=250)
    songs = models.ManyToManyField(Song, through='User_Rating')

class User_Rating(models.Model):
	rating = models.IntegerField(max_length=1,choices=RATING)

class Listen_Record(models.Model):
    User_Rating = models.IntegerField()