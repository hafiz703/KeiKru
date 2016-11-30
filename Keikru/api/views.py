from api.models import Album,Song,Artist,UserRatedSongs,Listen_Record
from rest_framework.generics import ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView,CreateAPIView,GenericAPIView
from django.views.generic import TemplateView,FormView
from django.views import generic
from django.db.models import Q
from django.views.decorators.csrf import csrf_protect
from django.views.generic.edit import CreateView,UpdateView,DeleteView
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect
from rest_framework.mixins import CreateModelMixin,UpdateModelMixin,DestroyModelMixin
from django.http import Http404
from rest_framework.exceptions import ValidationError

from api.serializers import(
    AlbumListSerializer,
    AlbumDetailSerializer,
    AlbumCreateSerializer,
    SongDetailSerializer,
    ArtistListSerializer,
    UserRatedSongsSerializer,
    ArtistDetailSerializer,
    ListenRecordListSerializer,
    SongRatingSerializer)

# Create search genre
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
                Q(rel_albums__tracks__song_title__icontains=query)|
                Q(rel_albums__genre__icontains=query)

            ).distinct()

        return queryset_list

class ArtistDetailAPIView(RetrieveAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer

class AlbumListAPIView(ListAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumListSerializer

class AlbumDetailAPIView(RetrieveAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumDetailSerializer

class SongListAPIView(ListAPIView):
    queryset = Song.objects.all()
    serializer_class = SongDetailSerializer

class SongDetailAPIView(RetrieveAPIView):
    queryset = Song.objects.all()
    serializer_class = SongDetailSerializer



class Song_RatingListAPIView(ListAPIView):
    queryset = UserRatedSongs.objects.all()
    serializer_class = UserRatedSongsSerializer

class Song_RatingCreateAPIView(CreateAPIView,CreateModelMixin):
    queryset = UserRatedSongs.objects.all()
    serializer_class = UserRatedSongsSerializer

    # def post(self, request, *args, **kwargs):

class ListenRecordCreateAPIView(GenericAPIView,CreateModelMixin,UpdateModelMixin):
    queryset = Listen_Record.objects.all()
    serializer_class = ListenRecordListSerializer

    def post(self, request, *args, **kwargs):
        filter = Listen_Record.objects.filter(user=request.data['user'],
                                              songid=request.data['songid'])
        if filter.exists():
            raise ValidationError({'error': 'POST not allowed, send PUT'})
        else:
            return self.create(request,*args,**kwargs)

    def put(self, request, *args, **kwargs):
        try:
            record = Listen_Record.objects.get(user=request.data['user'],
                                               songid=request.data['songid'])
            if record.listen_count is None:
                record.listen_count = 1
            record.listen_count = record.listen_count + 1
            record.save()
            return self.update(record, *args, **kwargs)
        except Listen_Record.DoesNotExist:
            raise ValidationError({"error": "Send POST not PUT to create records"})


class ListenRecordListAPIView(ListAPIView):
    queryset = Listen_Record.objects.all()
    serializer_class = ListenRecordListSerializer

