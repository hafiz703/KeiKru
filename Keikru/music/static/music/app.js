// Define the `Keithkuru` module
var myApp = angular.module('Keithkuru', ['ngResource']);
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
// myApp.controller("SignInController", ['$scope', 'dataService', function($scope,dataService) {
//   $scope.dataObj = dataService.dataObj;
//   $scope.signIn = function(username, password, userType) {
//     var users;
//     switch (userType) {
//       case 'Listener':
//         users = $scope.dataObj.listeners;
//         break;
//       case 'Artist':
//         users = $scope.dataObj.artists;
//         break;
//       case 'Label Manager':
//         users = $scope.dataObj.managers;
//         break;
//     }
//     for (i = 0; i < users.length; i++) {
//       if (username==users[i].name && password==users[i].password) {
//         $scope.dataObj.signedInUser = users[i];
//         return;
//       }
//     }
//     alert("Username and/or password combination is wrong!");
//   }
// }])
// Define the `SongController` controller on the `Keithkuru` module
myApp.controller("SongController", ['$scope', function($scope,dataService) {
  // $scope.dataObj = dataService.dataObj;

  $scope.showHome = true;
  $scope.showPlaylist = false;
  $scope.showProfile = false;
  $scope.myTitle = "Homepage";

  $scope.currentPlaylist = {}; // list shown on screen

  $scope.fillSearchBox = function() {
    console.log("worked");
  };
  $scope.showArtist = function(artist_id) {
    // 'http://127.0.0.1:8000/api/artist/4/?f=&format=json'
  };
  $scope.setRecommendedPlaylist = function() {
    // TODO: current user: A likes the same set of song as user B so recommend B's non-overlapping highly rated songs to A.
    // 'http://127.0.0.1:8000/api/user-song-rating/?f=&format=json'
  };
  $scope.setPlaylistByGenre = function() {

  };
  // $scope.songs = $http.get('http://127.0.0.1:8000/api/artist/4/?f=&format=json').then(function(response){
  //   console.log(response.data)
  //   return response.data
  // });
  $scope.setPlaylistBySong = function(searchWords) {
    // $scope.currentPlaylist = $scope.songs();
    // 'http://127.0.0.1:8000/api/?q='+searchWords+'/?f=&format=json'
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

// myApp.service('dataService', function() {
//   // private variable
//   var _dataObj = {
//     userType: null,
//     typesOfUsers: ['Listener','Artist','Label Manager'],
//     listeners: [
//       {
//         name: "minh",
//         password: "123456"
//       },
//       {
//         name: "weisheng",
//         password: "654321"
//       },
//       {
//         name: "pokemon",
//         password: "trainer"
//       }
//     ],
//     artists: [
//       {
//         name: "keith",
//         password: "696969"
//       },
//       {
//         name: "hafiz",
//         password: "666666"
//       }
//     ],
//     managers: [
//       {
//         name: "amos",
//         password: "choochoo"
//       },
//       {
//         name: "junhao",
//         password: "cocksucker"
//       }
//     ]
//   };
//   // public API
//   this.dataObj = _dataObj;
// })

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


//----------------------------------------> EXAMPLE AJAX GET REQUEST <----------------------------
//
//  $scope.songs = $http.get('http://127.0.0.1:8000/api/artist/4/?f=&format=json').then(function(response){
//           console.log(response.data)
//           return response.data
//
//       });

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
