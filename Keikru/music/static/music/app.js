// Define the `Keithkuru` module
var myApp = angular.module('Keithkuru', ['ngResource']);

myApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue =   decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
 function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

// Define the `SongController` controller on the `Keithkuru` module
myApp.controller("SongController", ['$scope','$http', function($scope,$http) {
  // $scope.dataObj = dataService.dataObj;
  $scope.allSongs = [];
  $.ajax({
    'type': 'GET',
    'url': 'http://127.0.0.1:8000/api/song/?format=json',
    'contentType': 'application/json',
    'dataType': 'json',
    'success': function(data) {
      for (i in data) {
        $scope.allSongs.push(data[i]);
      }
    }
  });  
  $scope.rated_song_IDs = [];

  $scope.listOfPages = ["Homepage", "Playlist", "Profile", "Create Album", "Create Song", "Edit Album", "Update Song", "ArtistAlbums"];
  $scope.currPage = 'Homepage';

  $scope.listOfUserType = ["user", "artist", "label"];

  $scope.NgUserType = document.getElementById("userInfo-userType").value;
  $scope.NgUserName = document.getElementById("userInfo-userName").value;
  $scope.NgUserID = document.getElementById("userInfo-userID").value;
  // $scope.NgUserID = "3";
  $scope.albumList = []; // other artists

  $scope.myAlbumList = [];

  $scope.currentPlaylist = {
    "name": 'placeholder',
    songList: []
  }; // playlist shown on screen

  $scope.uploadList = {
    name: 'placeholder',
    URL: 'placeholder.sutd.edu.sg'
  };

  $scope.setPlaylistByArtist = function(artist_id) {
    var link = 'http://127.0.0.1:8000/api/artist/'+artist_id+'/?format=json';
    $.ajax({
      'type': 'GET',
      'url': link, //updating song with song_id = 2
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        $scope.albumList = [];
        for (i in data.rel_albums) {
          album_name = data.rel_albums[i].album_name;
          album_id = data.rel_albums[i].id;
          album_art = data.rel_albums[i].album_art;
          album = {
            title: album_name,
            id: album_id,
            album_art: album_art
          };
          $scope.albumList.push(album);
        }
        $scope.changePage('ArtistAlbums');
      }
    });
  };

  $scope.setPlaylistBySearch = function(searchWords) {
    var link = "http://127.0.0.1:8000/api/artist/?format=json&q="+searchWords;
    $.ajax({
      'type': 'GET',
      'url': link, //updating song with song_id = 2
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        $scope.currentPlaylist.songList = [];
        $scope.currentPlaylist.name = 'Search results for '+searchWords;

        for (i in data) {
          artist = data[i];
          artistname = artist.artistname;
          artist_id = artist.id;
          for (j in artist['rel_albums']) {
            album = artist['rel_albums'][j];
            album_name = album['album_name'];
            album_id = album.id;

            genre = album.genre;
            for (k in album['tracks']) {
              track = album['tracks'][k];
              // console.log(track.song_title);
              var song = {
                song_title: track.song_title,
                album: {
                  artist: {
                    artistname: artistname,
                    id: artist_id
                  },
                  album_name: album_name,
                  id: album_id,
                  genre: genre
                },
                song_rating: track.song_rating
              };
              $scope.currentPlaylist.songList.push(song);
            }
          }
        }
        $scope.changePage('Playlist');
      }
    });
  };

  $scope.setRecommendedPlaylist = function() {
    var link = 'http://127.0.0.1:8000/api/user-song-rating/?format=json';
    $.ajax({
      'type': 'GET',
      'url': link, //updating song with song_id = 2
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        $scope.currentPlaylist.name = "Recommended Playlist";
        similarity = [];
        $scope.rated_song_IDs = [];
        rated_song_IDs_sim = [];
        for (usr in data) {
          if (data[usr].user!=$scope.NgUserID) {
            existing = false;
            for (i in similarity) {
              if (similarity[i].id==data[usr].user) {
                existing = true;
                break;
              }
            }
            if (!existing) {
              usr_diff = {
                id: data[usr].user,
                songsInCommon: [],
                similarityLevel: 0
              };
              similarity.push(usr_diff);
            }
          } else {
            $scope.rated_song_IDs.push(data[usr].song_rated);
          }
        }
        // console.log($scope.rated_song_IDs);
        for (usr in data) {
          if (data[usr].user==$scope.NgUserID) {
            for (usr_diff in data) {
              if (data[usr_diff].user!=$scope.NgUserID) {
                if (data[usr_diff].song_rated==data[usr].song_rated) {
                  for (stat in similarity) {
                    if (similarity[stat].id==data[usr_diff].user) {
                      similarity[stat].songsInCommon.push(data[usr_diff].song_rated);
                      similarity[stat].similarityLevel += Math.pow(data[usr_diff].rating-data[usr].rating,2);
                    }
                  }
                }
              }
            }
          }
        }
        // the lower the similarity the better
        // the bigger the songsInCommon the better
        // -> the lower the fraction the better
        // console.log(similarity);
        most_similar_usr = similarity[0];
        for (usr_diff in similarity) {
          if (similarity[usr_diff].songsInCommon.length!=0) {
            if ((similarity[usr_diff].similarity/similarity[usr_diff].songsInCommon.length)<(most_similar_usr.similarity/most_similar_usr.songsInCommon.length)) {
              most_similar_usr = similarity[usr_diff];
            }
          }
        }
        // console.log(most_similar_usr);
        recommended_song_IDs = [];
        for (usr in data) {
          if (data[usr].user==most_similar_usr.id) {
            rated_song_IDs_sim.push(data[usr].song_rated);
          }
        }

        for (song in rated_song_IDs_sim) {
          if (!$scope.rated_song_IDs.includes(rated_song_IDs_sim[song])) {
            recommended_song_IDs.push(rated_song_IDs_sim[song]);
          }
        }

        // console.log(recommended_song_IDs);
        for (i in $scope.allSongs) {
          if (recommended_song_IDs.includes($scope.allSongs[i].id)) {
            $scope.currentPlaylist.songList.push($scope.allSongs[i]);
          }
        }
        // console.log($scope.currentPlaylist.songList);
        $scope.changePage('Playlist');
      }
    });
  };

  $scope.setPlaylistByAlbum = function(album_id) {
    var link = 'http://127.0.0.1:8000/api/album/'+album_id+'/?format=json';
    $.ajax({
      'type': 'GET',
      'url': link, //updating song with song_id = 2
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        $scope.currentPlaylist.songList = [];
        $scope.currentPlaylist.name = data.album_name;
        for (i in data.tracks) {
          $scope.currentPlaylist.songList.push(data.tracks[i]);
        }
        $scope.changePage('Playlist');
      }
    });
  };

  $scope.setPlaylistByGenre = function(genre) {
    var link = 'http://127.0.0.1:8000/api/genre/?format=json&q='+genre;
    $.ajax({
      'type': 'GET',
      'url': link, //updating song with song_id = 2
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {

        $scope.currentPlaylist.songList = [];
        for (i in data) {
          artist = data[i];
          artistname = artist.artistname;
          artist_id = artist.id;
          for (j in artist['rel_albums']) {
            album = artist['rel_albums'][j];
            album_name = album['album_name'];
            album_id = album.id;
            $scope.currentPlaylist.name = album.genre+' song';
            genre = album.genre;
            for (k in album['tracks']) {
              track = album['tracks'][k];
              // console.log(track.song_title);
              var song = {
                song_title: track.song_title,
                album: {
                  artist: {
                    artistname: artistname,
                    id: artist_id
                  },
                  album_name: album_name,
                  id: album_id,
                  genre: genre
                },
                song_rating: track.song_rating
              };
              $scope.currentPlaylist.songList.push(song);
            }
          }
        }
        $scope.changePage('Playlist');
      }
    });
  };

  $scope.setSelectedRating = function (rating,song) {
      song.rating = rating;
  };

  $scope.changePage = function (page) {
    if ($scope.listOfPages.includes(page)) {
      // console.log("page selected: " + page);
      if (page=="Profile") {
        var link = 'http://127.0.0.1:8000/api/artist/'+$scope.NgUserID+'/?format=json';
        $.ajax({
          'type': 'GET',
          'url': link,
          'contentType': 'application/json',
          'dataType': 'json',
          'success': function(data) {
            $scope.myAlbumList = [];
            for (i in data.rel_albums) {
              album_name = data.rel_albums[i].album_name;
              album_id = data.rel_albums[i].id;
              album_art = data.rel_albums[i].album_art;
              album = {
                title: album_name,
                id: album_id,
                album_art: album_art
              };
              $scope.myAlbumList.push(album);
            }
          }
        });
      }
      $scope.currPage = page;
    }
    else {
      console.log("unknown page selected: " + page);
    }
  };

  $scope.createAlbum = function () {
    alert("Album uploaded!");
    $scope.changePage('Profile');
  };

  $scope.createSong = function () {
    alert("Song uploaded!");
    $scope.changePage('Edit Album');
  };

  $scope.updateSong = function () {
    alert("Song updated!");
    $scope.changePage('Edit Album');
  };

}])

myApp.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});


//----------------------------------------> EXAMPLE AJAX PUT REQUEST <----------------------------

//                                          Update song rating
// $.ajax({
//        'type': 'PUT',
//         'url': 'http://127.0.0.1:8000/api/song/updaterating/2', //updating song with song_id = 2
//         'contentType': 'application/json',
//         'data': JSON.stringify({
//              "song_rating":oldVal,
//          }),
//         'dataType': 'json',
//         'success': console.log("Posted!")
// });
