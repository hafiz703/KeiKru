from api.models import Album,Song,Artist,UserRatedSongs,Listen_Record
from rest_framework.generics import ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView,CreateAPIView,GenericAPIView
from django.views.generic import TemplateView,FormView
from django.views import generic
from django.db.models import Q
from django.views.decorators.csrf import csrf_protect
from django.views.generic.edit import CreateView,UpdateView,DeleteView
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponseRedirect
from rest_framework.mixins import CreateModelMixin,UpdateModelMixin,DestroyModelMixin,RetrieveModelMixin
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
    AlbumCreateUpdateDeleteSerializer,
    SongCreateUpdateDeleteSerializer,
    SongRatingSerializer)


#############################################################################
#############################################################################
#############################################################################
# Create search genre
class GenreSearchAPIView(ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistListSerializer

    def get_queryset(self, *args, **kwargs):
        queryset_list = Artist.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(rel_albums__genre__icontains=query)

            ).distinct()

        return queryset_list


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
#############################################################################
#############################################################################
class ArtistDetailAPIView(RetrieveAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer

#############################################################################
#############################################################################
#############################################################################

class AlbumListAPIView(ListAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumListSerializer

class AlbumDetailAPIView(RetrieveAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumDetailSerializer

class AlbumCreateAPIView(CreateAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumCreateUpdateDeleteSerializer

class AlbumEditAPIView(RetrieveAPIView,UpdateModelMixin,DestroyModelMixin):
    queryset =  Album.objects.all()
    serializer_class = AlbumCreateUpdateDeleteSerializer

    def put(self,request,*args,**kwargs):
        return self.update(request,*args,**kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

#############################################################################
#############################################################################
#############################################################################


class SongListAPIView(ListAPIView):
    queryset = Song.objects.all()
    serializer_class = SongDetailSerializer

class SongDetailAPIView(RetrieveAPIView):
    queryset = Song.objects.all()
    serializer_class = SongDetailSerializer

class SongCreateAPIView(CreateAPIView):
    queryset = Song.objects.all()
    serializer_class = SongCreateUpdateDeleteSerializer

class SongEditAPIView(RetrieveAPIView, UpdateModelMixin, DestroyModelMixin):
    queryset = Song.objects.all()
    serializer_class = SongCreateUpdateDeleteSerializer

    def put(self, request, *args, **kwargs):
            return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
            return self.destroy(request, *args, **kwargs)

#############################################################################
#############################################################################
#############################################################################

class Song_RatingListAPIView(ListAPIView):
    queryset = UserRatedSongs.objects.all()
    serializer_class = UserRatedSongsSerializer

class Song_RatingCreateAPIView(GenericAPIView,CreateModelMixin,UpdateModelMixin,RetrieveModelMixin):
    queryset = UserRatedSongs.objects.all()
    serializer_class = UserRatedSongsSerializer


    def post(self, request, *args, **kwargs):
        filter = UserRatedSongs.objects.filter(user=request.data['user'],
                                              song_rated=request.data['song_rated'])
        if filter.exists():
            raise ValidationError({'error': 'POST not allowed, send PUT'})
        else:
            return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        try:
            # record =  UserRatedSongs.objects.filter(user=request.data['user'], song_rated=request.data['song_rated'])

            record = UserRatedSongs.objects.get(user=request.data['user'],
                                                   song_rated=request.data['song_rated'])


            # record2 = UserRatedSongs.objects.get(user=request.data['user'],
            #                                     song_rated=request.data['song_rated'],rating=request.data['rating'])

            rating = self.request.data['rating']

            record.rating = rating
            record.save()
            return self.update(record, *args, **kwargs)
        except UserRatedSongs.DoesNotExist:
            raise ValidationError({"error": "Send POST not PUT to create records"})
        except AssertionError:
            raise ValidationError({"error": "Send POST not PUT to create records"})




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
                record.listen_count = 0
            record.listen_count += 1
            record.save()
            return self.update(record, *args, **kwargs)
        except AssertionError:
            raise ValidationError({"error": "Send POST not PUT to create records"})


class ListenRecordListAPIView(ListAPIView):
    queryset = Listen_Record.objects.all()
    serializer_class = ListenRecordListSerializer

