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

  $scope.showHome = true;
  $scope.showPlaylist = false;
  $scope.showProfile = false;
  $scope.myTitle = "Homepage";

  $scope.albumtitle = "Keith's Hottest Mixtape";
  $scope.albumlist = {
    id: "minh",
    li: [{
    "title": "Keith's Classical Rock-Pop Rap Remixes",
    name: 'fuck'
    },{
    "title": "Keith's Top 999999",
    name: 'fuck'
    },{
    "title": "Keith's Golden 1800s",
    name: 'fuck'
    }]
  };

  $scope.currentPlaylist = {
    name: 'placeholder',
    songList: []
  }; // playlist shown on screen

  getJson = function(link) {
    return $http.get(link).then(function(response){
      // console.log(response.data);
      return response.data;
    });
  }

  $scope.setPlaylistByArtist = function(artist_id) {
    var link = 'http://127.0.0.1:8000/api/'+artist_id;
    getJson(link).then(function(response){
      console.log(response[0]); // TODO
    });
    $scope.changePage('playlist');
  };
  $scope.setRecommendedPlaylist = function() {
    var link = 'http://127.0.0.1:8000/api/user-song-rating/?format=json';
    link = 'http://127.0.0.1:8000/api/song/2/?format=json';
    $.ajax({
      'type': 'GET',
      'url': link, //updating song with song_id = 2
      'contentType': 'application/json',
      'dataType': 'json',
      'success': function(data) {
        console.log(data);
        $scope.currentPlaylist.songList.push(data);
        $scope.changePage('playlist');
      }
    });
  };
  $scope.setPlaylistByGenre = function(genre) {
    var link = 'http://127.0.0.1:8000/api/genre/?format=json&q='+genre;
    getJson(link).then(function(response){
      console.log(response[0]);
    });
    $scope.changePage('playlist');
  };
  $scope.setSelectedRating = function (rating,song) {
      song.rating = rating;
  };

  $scope.changePage = function (page) {
    if (page == 'home') {
      $scope.showHome = true;
      $scope.showPlaylist = false;
      $scope.showProfile = false;
      $scope.myTitle = "Homepage";
    }
    else if (page == 'playlist') {
      $scope.showHome = false;
      $scope.showPlaylist = true;
      $scope.showProfile = false;
      $scope.myTitle = "Playlist";
    }
    else if (page == 'profile') {
      $scope.showHome = false;
      $scope.showPlaylist = false;
      $scope.showProfile = true;
      $scope.myTitle = "Profile";
    }
    else {
      console.log("unknown page selected");
    }
  };

  $scope.playSong = function (song) {
    $scope.songPath = song.filename;
    var audiobar = document.getElementById("audiobar");
    audiobar.play();
    $scope.isPlaying = true;
  };
  $scope.pauseSong = function () {
    var audiobar = document.getElementById("audiobar");
    audiobar.pause();
    $scope.isPlaying = false;
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
