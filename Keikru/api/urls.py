from django.conf.urls import url
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
                    AlbumListAPIView,
                    AlbumDetailAPIView,
                    ArtistDetailAPIView,
                    # AlbumUpdateAPIView,
                    # AlbumDeleteAPIView,
                    # AlbumCreateAPIView,
                    # SongCreateAPIView,
                    # MyView,
                    # SongUpdateView,
                    SongListAPIView,
                    SongDetailAPIView,
                    ArtistListAPIView,
                    Song_RatingListAPIView,
                    Song_RatingCreateAPIView,
                    ListenRecordCreateAPIView,
                    ListenRecordListAPIView,
                    GenreSearchAPIView,
                    AlbumCreateAPIView,
                    AlbumEditAPIView,
                    SongCreateAPIView,
                    SongEditAPIView,
                    ListenRecordDetailAPIView
                    )

#hafiz
#pa55word
app_name = 'api'

urlpatterns = [

    url(r'^artist/$', ArtistListAPIView.as_view(), name='artist-list'),
    url(r'^artist/(?P<pk>\d+)/$', ArtistDetailAPIView.as_view(), name='artist-detail'),

    url(r'^song/$', SongListAPIView.as_view(), name='song-list'),
    url(r'^song/(?P<pk>\d+)/$', SongDetailAPIView.as_view(), name='song-detail'),
    url(r'^song/create/$', SongCreateAPIView.as_view(), name='song-create'),
    url(r'^song/edit/(?P<pk>\d+)/$', SongEditAPIView.as_view(), name='song-edit'),

    url(r'^album/$', AlbumListAPIView.as_view(), name='album-list'),
    url(r'^album/(?P<pk>\d+)/$', AlbumDetailAPIView.as_view(), name='album-detail'),
    url(r'^album/create/$', AlbumCreateAPIView.as_view(),name = 'album-create'),
    url(r'^album/edit/(?P<pk>\d+)/$', AlbumEditAPIView.as_view(), name='album-edit'),


    url(r'^user-song-rating/$', Song_RatingListAPIView.as_view(),name ='user-rating-detail'),
    url(r'^user-song-rating/create/$', Song_RatingCreateAPIView.as_view(), name='user-rating-create'),


    url(r'^listen-record/create/$', ListenRecordCreateAPIView.as_view(), name = 'listen-record-createOrupdate' ),
    url(r'^listen-record/$', ListenRecordListAPIView.as_view(), name='listen-record-list'),
    url(r'^listen-record/(?P<user_pk>\d+)/$', ListenRecordDetailAPIView.as_view(), name='listen-record-detail'),


    url(r'^genre/$',GenreSearchAPIView.as_view(), name='genre-list'),

]

# urlpatterns = format_suffix_patterns(urlpatterns)