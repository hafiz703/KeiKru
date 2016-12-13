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

  $scope.listOfPages = ["Homepage", "Playlist", "Profile", "Create Album", "Create Song", "Edit Album", "Update Song", "Artists Albums", "History", "Credits"];
  $scope.currPage = 'Homepage';

  $scope.listOfUserType = ["user", "artist", "label"];

  $scope.songAlbumArt = "https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-9/15109341_10154615057689088_6880569998308639492_n.jpg?oh=862585562e3f9d9b8df0a6bcaf879df0&oe=58FB39FB";
  $scope.songAlbumTitle = "null";
  $scope.songArtistName = "null";
  $scope.songName = "null";

  $scope.currentPlaylist = {
    "name": 'placeholder',
    songList: []
  }; // playlist shown on screen

  $scope.uploadList = {
    name: 'placeholder',
    URL: 'placeholder.sutd.edu.sg'
  };
  $scope.rated_song_IDs = [];
  $scope.albumList = []; // display on artists album page
  $scope.allAlbumList = []; // display on home page
  $scope.myAlbumList = []; // display on profile if user is an artist
  $scope.myArtistList = []; // display on profile if user is an label
  $scope.listened_songs = [];

  loadRatedSongs = function() {
    $.ajax({
      'type': 'GET',
      'url': 'http://127.0.0.1:8000/api/user-song-rating/?format=json',
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        for (usr in data) {
          if (data[usr].user==$scope.NgUserID) {
            song = {
              id: data[usr].song_rated,
              rating: data[usr].rating
            };
            $scope.rated_song_IDs.push(song);
          }
        }
      }
    });
  };

  loadListenedSongs = function() {
    $.ajax({
      'type': 'GET',
      'url': 'http://127.0.0.1:8000/api/listen-record/?format=json',
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        for (usr in data) {
          if (data[usr].user==$scope.NgUserID) {
            count = data[usr].listen_count;
            if (data[usr].listen_count==null) {
              count = 1;
            }
            song = {
              songid: data[usr].songid,
              listen_count: count
            };
            $scope.listened_songs.push(song);
          }
        }
      }
    });
  };

  loadMyArtistsList = function () {
    $.ajax({
      'type': 'GET',
      'url': 'http://127.0.0.1:8000/api/label/'+$scope.NgUserID+'/?format=json',
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
          $scope.myArtistList = [];
          for (i in data.rel_artist) {
            artistname = data.rel_artist[i].artistname;
            artistid = data.rel_artist[i].id;
            artistpic = data.rel_artist[i].picture;
            artist = {
              name: artistname,
              id: artistid,
              picture: artistpic
            };
            $scope.myArtistList.push(artist);
          }
          // console.log("myArtistList: " + $scope.myArtistList);
        }
    });
  };

  loadMyAlbumList = function() {
    $.ajax({
      'type': 'GET',
      'url': 'http://127.0.0.1:8000/api/artist/'+$scope.NgUserID+'/?format=json',
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        $scope.myAlbumList = [];
        for (i in data.rel_albums) {
          album_name = data.rel_albums[i].album_name;
          album_id = data.rel_albums[i].id;
          album_art = data.rel_albums[i].album_art;
          album_rating = 0;
          for (j in data.rel_albums[i].tracks) {
            album_rating+=data.rel_albums[i].tracks[j].song_rating;
          }
          album_rating/=data.rel_albums[i].tracks.length;
          album = {
            title: album_name,
            id: album_id,
            album_rating: album_rating,
            album_art: album_art
          };
          $scope.myAlbumList.push(album);
        }
        // console.log("myAlbumList = " + $scope.myAlbumList)
      }
    });
  };

  loadRandomAlbum = function() {
    var link = 'http://127.0.0.1:8000/api/album/?format=json';
    $.ajax({
      'type': 'GET',
      'url': link,
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        $scope.allAlbumList = [];
        for (i in data) {
          album_name = data[i].album_name;
          album_art = data[i].album_art;
          album = {
            title: album_name,
            album_art: album_art
          };
          $scope.allAlbumList.push(album);
        }
        $scope.randomIndex = Math.floor(Math.random() * $scope.allAlbumList.length);
        $scope.randomAlbum1 = $scope.allAlbumList[$scope.randomIndex];
        $scope.allAlbumList.splice($scope.randomIndex, 1);
        $scope.randomAlbum2 = $scope.allAlbumList[Math.floor(Math.random() * $scope.allAlbumList.length)];
      }
    });
  };

  $scope.NgUserType = document.getElementById("userInfo-userType").value;
  $scope.NgUserName = document.getElementById("userInfo-userName").value;
  $scope.NgUserID = document.getElementById("userInfo-userID").value;

  loadRandomAlbum();
  loadMyAlbumList();
  loadMyArtistsList();
  loadRatedSongs();
  loadListenedSongs();

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
        $scope.changePage("Artists Albums");
      }
    });
  };

  $scope.setPlaylistBySearch = function(searchWords) {
    console.log($scope.listened_songs);
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
            album_art = album.album_art;

            genre = album.genre;
            for (k in album['tracks']) {

              track = album['tracks'][k];
                if(genre.toLowerCase().indexOf(searchWords) >-1 || album_name.toLowerCase().indexOf(searchWords) >-1 || artistname.toLowerCase().indexOf(searchWords) >-1 || track.song_title.toLowerCase().indexOf(searchWords) >-1 ) {
                    // console.log(track.song_title);
                    var song = {
                        id: track.id,
                        song_title: track.song_title,
                        album: {
                            artist: {
                                artistname: artistname,
                                id: artist_id,
                            },
                            album_name: album_name,
                            id: album_id,
                            album_art: album_art,
                            genre: genre
                        },
                        song_file: track.song_file,
                        song_rating: track.song_rating
                    };
                    $scope.currentPlaylist.songList.push(song);
                }
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
      'url': link,
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        $scope.currentPlaylist.name = "Recommended Playlist";
        similarity = [];
        // $scope.rated_song_IDs = [];
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
          }
          // else {
          //   song = {
          //     id: data[usr].song_rated,
          //     rating: data[usr].rating
          //   };
          //   $scope.rated_song_IDs.push(song);
          // }
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
            rated_song_IDs_sim.push(data[usr]);
          }
        }
        console.log(rated_song_IDs_sim);
        // console.log($scope.NgUserID);
        console.log($scope.listened_songs);
        for (song in rated_song_IDs_sim) {
          listened = false;
          for (song_listened in $scope.listened_songs) {
            if ($scope.listened_songs[song_listened].id == rated_song_IDs_sim[song].song_rated && $scope.listened_songs[song_listened].listen_count>0 ) {
              listened = true;
            }
          }
          if (!listened && rated_song_IDs_sim[song].rating>3) {
            recommended_song_IDs.push(rated_song_IDs_sim[song].song_rated);
          }
          // if (rated_song_IDs_sim[song].song_rated.toString=="32") {
          //   console.log(listened);
          // }
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
                id: track.id,
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
                song_file: track.song_file,
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

  $scope.setPlaylistByHistory = function() {
    $scope.currentPlaylist.songList = [];
    $scope.currentPlaylist.name = "Listen History";
    // loadListenedSongs();
    console.log($scope.listened_songs);
    for (song_listened in $scope.listened_songs) {
      for (song in $scope.allSongs) {
        if ($scope.listened_songs[song_listened].songid == $scope.allSongs[song].id && $scope.listened_songs[song_listened].listen_count>0) {
          song_to_be_pushed = $scope.allSongs[song];
          song_to_be_pushed.listen_count = $scope.listened_songs[song_listened].listen_count;
          $scope.currentPlaylist.songList.push(song_to_be_pushed);
        }
      }
    }
    // console.log($scope.currentPlaylist.songList);

    $scope.changePage('History');
  }

  $scope.setSelectedRating = function (rating,songID) {
    already_rated = false;
    for (rated_song in $scope.rated_song_IDs) {
      if ($scope.rated_song_IDs[rated_song].id==songID) {
        $scope.rated_song_IDs[rated_song].rating = rating;
        already_rated = true;
      }
    }
    if (!already_rated) {
      song = {
        id: songID,
        rating: rating
      };
      $scope.rated_song_IDs.push(song);      
    }
    for (song in $scope.currentPlaylist.songList) {
      if (songID == $scope.currentPlaylist.songList[song].id) {
        $scope.currentPlaylist.songList[song].user_rating = rating;
      }
    }
      
    $.ajax({
     'type': 'PUT',
      'url': 'http://127.0.0.1:8000/api/user-song-rating/create/',
      'contentType': 'application/json',
      'data': JSON.stringify({
        "rating": rating,
        "user": $scope.NgUserID,
        "song_rated": songID
        }),
      'dataType': 'json',
      'success': function() {

      }
    });

    $.ajax({
     'type': 'POST',
      'url': 'http://127.0.0.1:8000/api/user-song-rating/create/',
      'contentType': 'application/json',
      'data': JSON.stringify({
        "rating": rating,
        "user": $scope.NgUserID,
        "song_rated": songID
        }),
      'dataType': 'json',
      'success': function() {
        // console.log("2");
        // song = {
        //   id: songID,
        //   rating: rating
        // };
        // $scope.rated_song_IDs.push(song);
      }
    });
  };

  $scope.getRating = function(songID) {
    for (rated_song in $scope.rated_song_IDs) {
      if ($scope.rated_song_IDs[rated_song].id==songID) {
        return ($scope.rated_song_IDs[rated_song].rating);
      }
    }
    return 1;
  }

  $scope.editedAlbumID = "";
  $scope.goToEditAlbum = function(albumID) {
    $scope.editedAlbumID = albumID;
    $scope.changePage('Edit Album');
  }

  $scope.deleteAlbum = function(albumID) {
    $.ajax({
     'type': 'DELETE',
      'url': 'http://127.0.0.1:8000/api/album/edit/'+albumID,
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function() {

        alert('Album deleted!');
        loadMyAlbumList();
        $scope.changePage('Profile');
      }
    });
  }

  $scope.editAlbum = function(album_name,genre,album_art) {
    $.ajax({
     'type': 'PUT',
      'url': 'http://127.0.0.1:8000/api/album/edit/'+$scope.editedAlbumID+'/',
      'contentType': 'application/json',
      'data': JSON.stringify({
        "album_name": album_name,
        "genre": genre,
        "album_art": album_art,
        "artist": $scope.NgUserID
      }),
      'dataType': 'json',
      'success': function() {

        alert('Album added!');
        loadMyAlbumList();
        $scope.changePage('Profile');
      }
    });
  }

  $scope.createAlbum = function(album_name,genre,album_art) {
    $.ajax({
     'type': 'POST',
      'url': 'http://127.0.0.1:8000/api/album/create/',
      'contentType': 'application/json',
      'data': JSON.stringify({
        "album_name": album_name,
        "genre": genre,
        "album_art": album_art,
        "artist": $scope.NgUserID
      }),
      'dataType': 'json',
      'success': function() {

        alert('Album added!');
        loadMyAlbumList();
        $scope.changePage('Profile');
      }
    });
  }

  $scope.createSong = function(songName,songURL) {
    $.ajax({
     'type': 'POST',
      'url': 'http://127.0.0.1:8000/api/song/create/',
      'contentType': 'application/json',
      'data': JSON.stringify({
        "song_title": songName,
        "song_file": songURL,
        "album": $scope.editedAlbumID
      }),
      'dataType': 'json',
      'success': function() {
        alert('Song added!');
      }
    });
  }

  $scope.changeCriteria = function(criteria) {
    for (song in $scope.currentPlaylist.songList) {
      if (criteria=='name') {
        $scope.currentPlaylist.songList[song].criteria = $scope.currentPlaylist.songList[song].song_title;
      } else if (criteria=='artist') {
        $scope.currentPlaylist.songList[song].criteria = $scope.currentPlaylist.songList[song].album.artist.artistname;
      } else if (criteria=='album') {
        $scope.currentPlaylist.songList[song].criteria = $scope.currentPlaylist.songList[song].album.album_name;
      } else if (criteria=='genre') {
        $scope.currentPlaylist.songList[song].criteria = $scope.currentPlaylist.songList[song].album.genre;
      }
    }
    // console.log($scope.currentPlaylist.songList[0].criteria);
  }
  $scope.changePage = function (page) {
    if (page=="Playlist") {
      for (song in $scope.currentPlaylist.songList) {
        $scope.currentPlaylist.songList[song].criteria = $scope.currentPlaylist.songList[song].id;
      }
      for (song in $scope.currentPlaylist.songList) {
        for (rated_song in $scope.rated_song_IDs) {
          if ($scope.rated_song_IDs[rated_song].id == $scope.currentPlaylist.songList[song].id) {
            $scope.currentPlaylist.songList[song].user_rating = $scope.rated_song_IDs[rated_song].rating;
          }
        }
        if ($scope.currentPlaylist.songList[song].user_rating==null || $scope.currentPlaylist.songList[song].user_rating==0) {
          $scope.currentPlaylist.songList[song].user_rating = 1;
        }
      }
    }
    if ($scope.listOfPages.includes(page)) {
      $scope.currPage = page;
    }
    else {
      console.log("unknown page selected: " + page);
    }
  };

  $scope.updateSong = function () {
    alert("Song updated!");
    $scope.changePage('Edit Album');
  };

  $scope.playSong = function (song) {
    console.log($scope.listened_songs);
    listened = false;
    for (song_listened in $scope.listened_songs) {
      listened = false;
      if ($scope.listened_songs[song_listened].songid==song.id) {
        listened = true;
        $scope.listened_songs[song_listened].listen_count++;
        break;
        // console.log("incremented");
      }
    }
    if (!listened) {
      listen_record = {
        listen_count: 1,
        songid: song.id,
      };
      $scope.listened_songs.push(listen_record);

      // console.log('PUT count added!');
    }
    console.log(song);
    var audiobar = document.getElementById("audiobar");
    audiobar.src = song.song_file;
    $scope.songAlbumArt = song.album.album_art;
    $scope.songAlbumTitle = song.album.album_name;
    $scope.songArtistName = song.album.artist.artistname;
    $scope.songName = song.song_title;
    audiobar.load();
    audiobar.play();
    $.ajax({
     'type': 'POST',
      'url': 'http://127.0.0.1:8000/api/listen-record/create/',
      'contentType': 'application/json',
      'data': JSON.stringify({
        "listen_count": null,
        "user": $scope.NgUserID.toString(),
        "songid": song.id.toString(),
      }),
      'dataType': 'json',
      'success': function() {
        console.log('POST count added!');
      }
    });
    $.ajax({
     'type': 'PUT',
      'url': 'http://127.0.0.1:8000/api/listen-record/create/',
      'contentType': 'application/json',
      'data': JSON.stringify({
        "listen_count": null,
        "user": $scope.NgUserID.toString(),
        "songid": song.id.toString(),
      }),
      'dataType': 'json',
      'success': function() {
        console.log('PUT count added!');
      }
    });
    // $scope.isPlaying = true;
  };
  // $scope.pauseSong = function () {
  //   var audiobar = document.getElementById("audiobar");
  //   audiobar.pause();
  //   $scope.isPlaying = false;
  // };

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

myApp.directive('starRatingStatic', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '='
        },
        link: function (scope, elem, attrs) {
            scope.stars = [];
            for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.ratingValue
                });
            }
        }
    }
});
//----------------------------------------> EXAMPLE AJAX PUT REQUEST <----------------------------

//                                          Update song rating
