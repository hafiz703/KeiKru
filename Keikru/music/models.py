from django.db import models
from django.contrib.auth.models import User
# from api.models import Label


class Label(models.Model):
    name = models.CharField(max_length=500,unique=True,default="Independent")

    def __str__(self):
        return self.name


class ArtistRegistered(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	artistname = models.CharField(max_length=200, unique = True)
	label = models.ForeignKey(Label,max_length=200)
	picture = models.CharField(max_length=200)

	def __str__(self):
		return self.artistname

class UserRegistered(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	name = models.CharField(max_length=200, unique = True)
	
	def __str__(self):
		return self.name

