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

  $scope.currentPlaylist = {
    "name": 'placeholder',
    songList: []
  }; // playlist shown on screen

  $scope.rated_song_IDs = [];
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

  $scope.uploadList = {
    name: 'placeholder',
    URL: 'placeholder.sutd.edu.sg'
  };

  $scope.albumList = []; // display on artists album page
  $scope.allAlbumList = []; // display on home page
  $scope.myAlbumList = []; // display on profile if user is an artist
  $scope.myArtistList = []; // display on profile if user is an label

  $scope.loadMyArtistsList = function () {
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

  $scope.loadMyAlbumList = function() {
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
          album = {
            title: album_name,
            id: album_id,
            album_art: album_art
          };
          $scope.myAlbumList.push(album);
        }
        // console.log("myAlbumList = " + $scope.myAlbumList)
      }
    });
  };

  $scope.loadRandomAlbum = function() {
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

  $scope.loadRandomAlbum();
  $scope.loadMyAlbumList();
  $scope.loadMyArtistsList();

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
              //   console.log(track.song_title)
              //   console.log(track.song_title.indexOf(searchWords))
                if(genre.toLowerCase().indexOf(searchWords) > -1 ||  album_name.toLowerCase().indexOf(searchWords) > -1|| artistname.toLowerCase().indexOf(searchWords) > -1|| track.song_title.toLowerCase().indexOf(searchWords) > -1) {
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
            rated_song_IDs_sim.push(data[usr].song_rated);
          }
        }
        // console.log(rated_song_IDs_sim);
        for (song in rated_song_IDs_sim) {
          rated = false;
          for (song_rated in $scope.rated_song_IDs) {
            if ($scope.rated_song_IDs[song_rated].id == rated_song_IDs_sim[song]) {
              rated = true;
            }
          }
          if (!rated) {
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
    for (rated_song in $scope.rated_song_IDs) {
      for (song in $scope.allSongs) {
        if ($scope.rated_song_IDs[rated_song].id == $scope.allSongs[song].id) {
          $scope.currentPlaylist.songList.push($scope.allSongs[song]);
        }
      }
    }
    // console.log($scope.currentPlaylist.songList);

    $scope.changePage('History');
  }

  $scope.setSelectedRating = function (rating,songID) {
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
        for (rated_song in $scope.rated_song_IDs) {
          if ($scope.rated_song_IDs[rated_song].id==songID) {
            $scope.rated_song_IDs[rated_song].rating = rating;
          }
        }
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
        song = {
          id: songID,
          rating: rating
        };
        $scope.rated_song_IDs.push(song);
      }
    });
  };

  $scope.getRating = function(songID) {
    for (rated_song in $scope.rated_song_IDs) {
      if ($scope.rated_song_IDs[rated_song].id==songID) {
        return $scope.rated_song_IDs[rated_song].rating;
      }
    }
    return 1;
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
    console.log($scope.currentPlaylist.songList[0].criteria);
  }
  $scope.changePage = function (page) {
    if (page=="Playlist") {
      for (song in $scope.currentPlaylist.songList) {
        $scope.currentPlaylist.songList[song].criteria = $scope.currentPlaylist.songList[song].id;
      }
      // console.log($scope.currentPlaylist.songList[0].criteria);
    }
    if ($scope.listOfPages.includes(page)) {
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



  // ng-click="playSong(song)"

  // $scope.playSong = function (song) {
  //     $scope.songPath = song.filename;
  //     var audiobar = document.getElementById("audiobar");
  //     audiobar.play();
  //     $scope.isPlaying = true;
  // };
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


//----------------------------------------> EXAMPLE AJAX PUT REQUEST <----------------------------

//                                          Update song rating
// $.ajax({
//  'type': 'PUT',
//   'url': 'http://127.0.0.1:8000/api/user-song-rating/create/'
//   'contentType': 'application/json',
//   'data': JSON.stringify({
//     "rating": <new rating>,
//     "user": <user_id>,
//     "song_rated": <song_id>
//     }),
//   'dataType': 'json',
//   'success': console.log("Posted!")
// });
