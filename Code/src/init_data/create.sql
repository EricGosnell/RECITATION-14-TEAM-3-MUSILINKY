DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

-- Playlist table
CREATE TABLE Playlist (
  id int PRIMARY KEY SERIAL,
  name TEXT NOT NULL,
  creator TEXT NOT NULL
);

-- Track table
CREATE TABLE Track (
  id int SERIAL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration int NOT NULL,
  playlist_id int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (playlist_id) REFERENCES Playlist(id)
);

-- Retrieve some information about the playlist
SELECT name, creator, COUNT(*) AS track_count, SUM(duration) AS total_duration
FROM Playlist p
JOIN Track t ON p.id = t.playlist_id
WHERE p.id = 1
GROUP BY p.id;
