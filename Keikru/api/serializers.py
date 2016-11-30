from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from api.models import Album,Song,Artist,UserRatedSongs,Listen_Record


# obj_data = AlbumSerializer(obj,many=True) IMPORTANT TO SET FLAGGG
# obj = Album.objects.raw("Select * from api_Album,api_Artist where api_Album.artist_id=api_Artist.id and  api_Artist.name = 'Panic! At the Disco'")


class SongDetailSerializer(ModelSerializer):
    # artist = ArtistDetailSerializer(many=False, read_only=True)
    # artist = serializers.CharField(read_only=True, source="artist_set" )
    # album_name = album.get_attribute("album_name")


    class Meta:
        model = Song
        fields = [
            'id',
            'song_title',
            'song_rating',
            'song_file',


        ]

        depth = 2

class SongRatingSerializer(ModelSerializer):

    class Meta:
        model = Song
        fields = [
            'id',
            # 'album',
            #'song_title',
            'song_rating',
            #'album',


        ]

class AlbumCreateSerializer(ModelSerializer):

    class Meta:
        model = Album
        fields = [

            'album_name',
            'album_rating',

            # 'name',

        ]

class AlbumListSerializer(ModelSerializer):
    tracks = SongDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = [
            'id',
            'album_name',
            'album_rating',
            'date_created',
            'album_art',
            'genre',
            'artist',
            # 'rel_artist'
            'tracks',
            # 'artist_name',

        ]
        # depth = 1

class AlbumDetailSerializer(ModelSerializer):

    class Meta:
        model = Album
        fields = [
            'id',
            'album_name',
            'genre',
            'album_rating',
            # 'date_created',
            'album_art',
            'rel_artist'

        ]

class ArtistListSerializer(ModelSerializer):
    rel_albums = AlbumListSerializer(many=True, read_only=True)

    class Meta:
        model = Artist
        fields = [
            'id',
            'name',
            'rel_albums',


        ]
class ArtistDetailSerializer(ModelSerializer):
    rel_albums = AlbumListSerializer(many=True, read_only=True)

    class Meta:
        model = Artist
        fields = [
            'id',
            'name',
            'rel_albums',


        ]
class UserRatedSongsSerializer(ModelSerializer):
    # user_id = serializers.Field(source='user.id')
    class Meta:
        model = UserRatedSongs
        fields = [
            'user',
            'song_rated',
            'rating',
        ]


class ListenRecordListSerializer(ModelSerializer):

    class Meta:
        model = Listen_Record
        fields = [
            'listen_count',
            'user',
            'songid',
        ]

        extra_kwargs = {
            'url': { 'lookup_field': 'user_id'}

        }

