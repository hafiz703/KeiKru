

--Drop Schema dbproj;
--Create Schema dbproj;
use dbproj;
Create Table Users(
  user_id int NOT NULL AUTO_INCREMENT,
  username char(50) NOT NULL UNIQUE,
  password char(20),
  Primary Key (user_id)
);



Create table Record_Label(
  label_id int,
  label_name char(20),
  Primary Key (label_id)
);

Create table Artiste(
  artiste_id int,
  artiste_name char(50),
  managed_by int  NOT NULL,

  Primary Key (artiste_id),
  Foreign Key (managed_by) References Record_Label(label_id)

) ;

Create table Album(
  album_id int,
  album_name char(20),
  genre char(20),
  song_avg_rating int,
  contributing_artiste int  NOT NULL,

  Primary Key (album_id),
  Foreign Key (contributing_artiste) References Artiste(artiste_id)
);

Create table Song(
  song_id int,
  song_name char(20),
  avg_rating int,
  play_count int,
  album_id int NOT NULL,

  Primary Key (song_id),
  Foreign Key (album_id) REFERENCES Album(album_id)

);

  Create table listen_record(
  user_id int NOT NULL,
  user_rating int,
  song_id int,
  rating_date Date,

  Primary Key (user_id , song_id),
  Foreign Key (user_id) References Users(user_id),
  Foreign Key (song_id) References Song(song_id)




);
#
# Create Trigger avg_song_rating After update on listen_record(
#   For Each row
#   Update Song set avg_rating =
# )

