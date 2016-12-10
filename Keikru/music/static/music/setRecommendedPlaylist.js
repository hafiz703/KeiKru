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
          if (data[usr].user!=$scope.userID) {
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
          if (data[usr].user==$scope.userID) {
            for (usr_diff in data) {
              if (data[usr_diff].user!=$scope.userID) {
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