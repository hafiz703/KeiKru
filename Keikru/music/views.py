from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from .forms import Form, UserForm, ArtistForm
from .models import Label, UserRegistered, ArtistRegistered

def index(request):
    if not request.user.is_authenticated():
        return render(request, 'music/login.html')
    else:
        user = request.user
        username = request.user.username
        user_type = "no type"
        user_id = user.id
        try:
            user_registered = UserRegistered.objects.get(user = user)
            user_type = "user"
            user_id = user_registered.id
        except:
            try:
                artist_registered = ArtistRegistered.objects.get(user = user)
                user_type = "artist"
                user_id = artist_registered.id
            except:
                try:
                    user_type = "label"
                    user_id = Label.objects.get(name=username).id
                except:
                    user_type = "admin"
        context = {
            "username": username, "user_type": user_type, "user_id": user_id
        }
        return render(request, 'music/index.html', context)

def register(request):

    if request.method == 'POST':
        # Attempt to grab information from the raw form information
        form = Form(data=request.POST)
        user_form = UserForm(data=request.POST)

        if form.is_valid() and user_form.is_valid():
            # Save the user's form data to the database
            user = form.save()
            # Now we hash the password with the set_password method
            # Update the user object
            user.set_password(user.password)
            user.save()

            # Since we need to set the user attribute ourselve, we set commit=False
            # This delays saving the model until we're ready to avoid integrity problems
            user_user = user_form.save(commit=False)
            user_user.user = user
            user_user.save()
            
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    user_type = "no type"
                    user_id = user.id
                    try:
                        user_registered = UserRegistered.objects.get(user = user)
                        user_type = "user"
                        user_id = user_registered.id
                    except:
                        try:
                            artist_registered = ArtistRegistered.objects.get(user = user)
                            user_type = "artist"
                            user_id = artist_registered.id
                        except:
                            try:
                                user_type = "label"
                                user_id = Label.objects.get(name=username).id
                            except:
                                user_type = "admin"
                    context = {
                        "username": username, "user_type": user_type, "user_id": user_id
                    }
                    return render(request, 'music/index.html', context)
    else:
        form = Form()
        user_form = UserForm()
    context = {
        'form': form, 'user_form': user_form
    }
    return render(request, 'music/register.html', context)

def register_artist(request):
    labels = Label.objects
    if request.method == 'POST':
        # Attempt to grab information from the raw form information
        form = Form(data=request.POST)
        artist_form = ArtistForm(data=request.POST)

        if form.is_valid() and artist_form.is_valid():
            # Save the user's form data to the database
            user = form.save()
            # Now we hash the password with the set_password method
            # Update the user object
            user.set_password(user.password)
            user.save()

            # Since we need to set the user attribute ourselve, we set commit=False
            # This delays saving the model until we're ready to avoid integrity problems
            artist = artist_form.save(commit=False)
            artist.user = user
            artist.save()

            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    user_type = "no type"
                    user_id = user.id
                    try:
                        user_registered = UserRegistered.objects.get(user = user)
                        user_type = "user"
                        user_id = user_registered.id
                    except:
                        try:
                            artist_registered = ArtistRegistered.objects.get(user = user)
                            user_type = "artist"
                            user_id = artist_registered.id
                        except:
                            try:
                                user_type = "label"
                                user_id = Label.objects.get(name=username).id
                            except:
                                user_type = "admin"
                    context = {
                        "username": username, "user_type": user_type, "user_id": user_id
                    }
                    return render(request, 'music/index.html', context)
    else:
        form = Form()
        artist_form = ArtistForm()

    context = {
        'form': form, 'artist_form': artist_form, 'labels': labels
    }
    return render(request, 'music/register_artist.html', context)

def logout_user(request):
    logout(request)
    user_form = Form(request.POST or None)
    context = {
        "user_form": user_form,
    }
    return render(request, 'music/login.html', context)


def login_user(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                user_type = "no type"
                user_id = user.id
                try:
                    user_registered = UserRegistered.objects.get(user = user)
                    user_type = "user"
                    user_id = user_registered.id
                except:
                    try:
                        artist_registered = ArtistRegistered.objects.get(user = user)
                        user_type = "artist"
                        user_id = artist_registered.id
                    except:
                        try:
                            user_type = "label"
                            user_id = Label.objects.get(name=username).id
                        except:
                            user_type = "admin"
                context = {
                    "username": username, "user_type": user_type, "user_id": user_id 
                }
                return render(request, 'music/index.html', context)
            else:
                return render(request, 'music/login.html', {'error_message': 'Your account has been disabled'})
        else:
            return render(request, 'music/login.html', {'error_message': 'Invalid login'})
    return render(request, 'music/login.html')
