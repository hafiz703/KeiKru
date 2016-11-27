from api.models import Album,Song,Artist
from rest_framework.generics import ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView,CreateAPIView
from django.views.generic import TemplateView,FormView
from django.views import generic
from django.db.models import Q
from django.views.decorators.csrf import csrf_protect
from django.views.generic.edit import CreateView,UpdateView,DeleteView
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect

from api.serializers import(
    AlbumListSerializer,
    AlbumDetailSerializer,
    AlbumCreateSerializer,
    SongDetailSerializer,
    ArtistListSerializer,
    SongRatingSerializer)


class ArtistListAPIView(ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistListSerializer

    def get_queryset(self, *args, **kwargs):
        queryset_list = Artist.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(name__icontains=query)|
                Q(rel_albums__album_name__icontains=query)|
                Q(rel_albums__tracks__song_title__icontains=query)

            ).distinct()

        return queryset_list

class AlbumListAPIView(ListAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumListSerializer

class AlbumDetailAPIView(RetrieveAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumDetailSerializer


class SongDetailAPIView(RetrieveAPIView):
    queryset = Song.objects.all()
    serializer_class = SongDetailSerializer

class SongListAPIView(ListAPIView):
    queryset = Song.objects.all()
    serializer_class = SongDetailSerializer

