// Define the `Keithkuru` module
var myApp = angular.module('Keithkuru', ['ngResource']);

myApp.controller("SignInController", ['$scope', 'dataService', function($scope,dataService) {
  $scope.dataObj = dataService.dataObj;
  $scope.signIn = function(username,password,userType) {
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
  $scope.currentPlaylist = {}; // playlist shown on screen
  $scope.recentSongs = ['Majulah Singapura','Good Blood','Further'];
  $scope.filterSearchResults = function(searchWords,songName){
    if (searchWords==null || searchWords=="") {
      return true;
    }
    return (songName.toUpperCase().indexOf(searchWords.toUpperCase())>-1);
  };
  console.log("song controller");
  $scope.fillSearchBox = function(something) {
    // $scope.trial();
    alert("sddsf");
  };
  $scope.searchState = {
    visibility: false
  }
  $scope.trial = function() {
    alert("adf");
  }
  // add arguments to here
  $scope.setPlaylist = function() {
    // make an SQL query
    $scope.currentPlaylist = {
      name: '1989',
      songList: [
      {
        name:'Welcome to New York',
        length: "3:02",
        rating: 2,
        filename: '../../assets/songs/1.m4a',
        ff: function() {
          console.log("hello");
        }
      },
      {
        name: 'Bad Blood',
        length: "4:59",
        rating: 1,
        filename: '../../assets/songs/8.m4a'
      },
      {
        name:'Style',
        length: "2:43",
        rating: 1,
        filename: '../../assets/songs/3.m4a'
      },
      {
        name:'Out of the woods',
        length: "5:01",
        rating:3,
        filename: '../../assets/songs/4.m4a'
      }]
    };
    $scope.showHome = false;
  };
  $scope.rating = 0;

  $scope.setSelectedRating = function (rating,song) {
      song.rating = rating;
  }
  
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

function play(){
  var audio = document.getElementById("audio");
  audio.play();
  console.log("play");
}
function pause(){
  var audio = document.getElementById("audio");
  audio.pause();
  // console.log("play");
}