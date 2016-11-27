from django.conf.urls import url
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
                    AlbumListAPIView,
                    AlbumDetailAPIView,
                    # AlbumUpdateAPIView,
                    # AlbumDeleteAPIView,
                    # AlbumCreateAPIView,
                    # SongCreateAPIView,
                    # MyView,
                    # SongUpdateView,
                    SongListAPIView,
                    SongDetailAPIView,
                    ArtistListAPIView
                    )

#hafiz
#pa55word
app_name = 'api'

urlpatterns = [

    url(r'^artist/$', ArtistListAPIView.as_view(), name='artist-list'),
    url(r'^album/$', AlbumListAPIView.as_view(), name='album-list'),
    url(r'^song/$', SongListAPIView.as_view(), name='song-list'),
    url(r'^song/(?P<pk>\d+)/$', SongDetailAPIView.as_view(), name='song-detail'),
    url(r'^album/(?P<pk>\d+)/$', AlbumDetailAPIView.as_view(), name='album-detail'),

]

# urlpatterns = format_suffix_patterns(urlpatterns)