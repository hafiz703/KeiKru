from api.models import Album,Song,Artist,UserRatedSongs,Listen_Record
from music.models import Label
from rest_framework.generics import ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView,CreateAPIView,GenericAPIView
from django.views.generic import TemplateView,FormView
from django.views import generic
from django.db.models import Q,Sum
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
    LabelDetailSerializer,
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
                Q(artistname__icontains=query)|
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


    def setAverageSongRating(self,song_rated,req):
        song_id_rated = song_rated
        print(song_id_rated)
        get_all_ratings = UserRatedSongs.objects.filter(song_rated=song_id_rated).exclude(user__id = self.request.data['user'])
        get_all = UserRatedSongs.objects.filter(song_rated=song_id_rated)
        # print(get_all_ratings.g)
        try:
            filter = int(get_all_ratings.all().aggregate(Sum('rating'))['rating__sum'])
        except TypeError:
            filter=0
        # print("filter: ", filter)
        try:
            # print("new rating",self.request.data['rating'])
            filter += int(self.request.data['rating'])

            if req == 'PUT':
                length = len(get_all)
            else:
                length = len(get_all)+1
            length=1 if length==0 else length


            # print("length: ",length)
            average = filter/length

            record = Song.objects.get(id=song_id_rated)
            record.song_rating = average
            record.save()
            # print("average: ",average)


        except AttributeError:
            print("AttributeError")

        # songid = filter.song_rated
        # songRecord = Song.objects.get(id = request.data['id'])


    def post(self, request, *args, **kwargs):
        song_id_rated = self.request.data['song_rated']
        get_all_ratings = UserRatedSongs.objects.filter(song_rated = song_id_rated)
        filter = UserRatedSongs.objects.filter(user=request.data['user'],
                                              song_rated=request.data['song_rated'])
        if filter.exists():

            raise ValidationError({'error': 'POST not allowed, send PUT'})
        else:
            self.setAverageSongRating(song_id_rated,"POST")
            return self.create(request, *args, **kwargs)

        # setAverageSongRating(self, request, *args, **kwargs)


    def put(self, request, *args, **kwargs):
        try:
            # record =  UserRatedSongs.objects.filter(user=request.data['user'], song_rated=request.data['song_rated'])
            song_id_rated = self.request.data['song_rated']
            record = UserRatedSongs.objects.get(user=request.data['user'],
                                                   song_rated=request.data['song_rated'])


            # record2 = UserRatedSongs.objects.get(user=request.data['user'],
            #                                     song_rated=request.data['song_rated'],rating=request.data['rating'])

            rating = self.request.data['rating']

            record.rating = rating
            record.save()
            self.setAverageSongRating(song_id_rated,"PUT")
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

    def get_queryset(self, *args, **kwargs):
        queryset_list = Listen_Record.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(user_id__exact=query)

            ).distinct()

        return queryset_list

class ListenRecordDetailAPIView(RetrieveAPIView):
    queryset = Listen_Record.objects.all()
    serializer_class = ListenRecordListSerializer

    def get_queryset(self, *args, **kwargs):
        queryset_list = Listen_Record.objects.all()
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(user__user_id__exact=query)

            ).distinct()

        return queryset_list

class LabelDetailAPIView(RetrieveAPIView):
    queryset = Label.objects.all()
    serializer_class = LabelDetailSerializer

class LabelListAPIView(ListAPIView):
    queryset = Label.objects.all()
    serializer_class = LabelDetailSerializer
