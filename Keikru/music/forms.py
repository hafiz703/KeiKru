from django import forms
from django.contrib.auth.models import User
from .models import ArtistRegistered, UserRegistered

class Form(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ['username', 'password']

class ArtistForm(forms.ModelForm):
	picture = forms.URLField(max_length=1000)
	class Meta:
		model = ArtistRegistered
		fields = ['artistname', 'label', 'picture']


class UserForm(forms.ModelForm):
	class Meta:
		model = UserRegistered
		fields = ['name']