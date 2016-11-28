// Define the `Keithkuru` module
var myApp = angular.module('Keithkuru', ['ngResource']);

myApp.controller("SignInController", ['$scope', 'dataService', function($scope,dataService) {
  $scope.dataObj = dataService.dataObj;
  $scope.signIn = function(username, password, userType) {
    var users;
    switch (userType) {
      case 'Listener':
        users = $scope.dataObj.listeners;
        break;
      case 'Artist':
        users = $scope.dataObj.artists;
        break;
      case 'Label Manager':
        users = $scope.dataObj.managers;
        break;
    }
    for (i = 0; i < users.length; i++) {
      if (username==users[i].name && password==users[i].password) {
        $scope.dataObj.signedInUser = users[i];
        return;
      }
    }
    alert("Username and/or password combination is wrong!");
  }
}])
// Define the `SongController` controller on the `Keithkuru` module
myApp.controller("SongController", ['$scope', 'dataService', function($scope,dataService) {
  $scope.dataObj = dataService.dataObj;
  $scope.showHome = true;
  $scope.currentPlaylist = {}; // list shown on screen
  $scope.recentSongs = ['Majulah Singapura','Good Blood','Further'];
  $scope.filterSearchResults = function(searchWords,songName){
    if (searchWords==null || searchWords=="") {
      return true;
    }
    return (songName.toUpperCase().indexOf(searchWords.toUpperCase())>-1);
  };
  $scope.fillSearchBox = function() {
    console.log("worked");
  };
  $scope.showArtist = function(artist) {
    // TODO: search by artist. Show bunch of albums like home or show all songs as flat 1 list?
  };
   $scope.setRecommendedPlaylist = function() {
    // TODO: get recommended playlist
  };
   $scope.setPlaylistByGenre = function() {
    // TODO
  };
  $scope.setPlaylistBySong = function(searchWords) {
    // TODO
    $scope.currentPlaylist = {
      name: "1989",
      // demo purpose: live change the stars and see how recommended playlist changes
      songList: [
        {
          title: "Out of the woods",
          artist: "Taylor Swift",
          length: "06:69",
          rating: 3,
          genre: "Pop",
          index: 4
        },
        {
          title: "Style",
          artist: "Taylor Swift",
          length: "06:69",
          rating: 3,
          genre: "Pop",
          index: 1
        },
        {
          title: "Welcome to New York",
          artist: "Taylor Swift",
          length: "06:69",
          rating: 3,
          genre: "Pop",
          index: 2
        },
        {
          title: "Bad Blood",
          artist: "Taylor Swift",
          length: "06:69",
          rating: 3,
          genre: "Pop",
          index: 3
        }
      ]
    }; // set this to something
    $scope.showHome = false;
  };

  $scope.setSelectedRating = function (rating,song) {
      song.rating = rating;
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

myApp.service('dataService', function() {
  // private variable
  var _dataObj = {
    userType: null,
    typesOfUsers: ['Listener','Artist','Label Manager'],
    listeners: [
      {
        name: "minh",
        password: "123456"
      },
      {
        name: "weisheng",
        password: "654321"
      },
      {
        name: "pokemon",
        password: "trainer"
      }
    ],
    artists: [
      {
        name: "keith",
        password: "696969"
      },
      {
        name: "hafiz",
        password: "666666"
      }
    ],
    managers: [
      {
        name: "amos",
        password: "choochoo"
      },
      {
        name: "junhao",
        password: "cocksucker"
      }
    ]
  };
  // public API
  this.dataObj = _dataObj;
})

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

// function play(){
//   var audio = document.getElementById("audio");
//   audio.play();
// }
// function pause(){
//   var audio = document.getElementById("audio");
//   audio.pause();
//   console.log("play");
// }
