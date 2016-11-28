from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from api.models import Album,Song,Artist


# obj_data = AlbumSerializer(obj,many=True) IMPORTANT TO SET FLAGGG
# obj = Album.objects.raw("Select * from api_Album,api_Artist where api_Album.artist_id=api_Artist.id and  api_Artist.name = 'Panic! At the Disco'")


class SongDetailSerializer(ModelSerializer):

    class Meta:
        model = Song
        fields = [
            'id',
            # 'album',
            'song_title',
            'song_rating',
            'song_file',


        ]

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
            'tracks',


        ]

class AlbumDetailSerializer(ModelSerializer):

    class Meta:
        model = Album
        fields = [
            'id',
            'album_name',
            'genre',
            'album_rating',
            # 'date_created',
            'album_art'

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
