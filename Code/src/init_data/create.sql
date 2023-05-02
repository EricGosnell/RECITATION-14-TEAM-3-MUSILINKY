DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS users_to_playlists CASCADE;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    bio VARCHAR (250)
);

CREATE TABLE IF NOT EXISTS connections (
    user1_id INT NOT NULL,
    user2_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS playlists (
    playlist_id SERIAL PRIMARY KEY
--     TODO: Add playlist data (owner, songs, length, etc)
);

CREATE TABLE IF NOT EXISTS users_to_playlists (
    user_id INT NOT NULL,
    playlist_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists (playlist_id)
);

-- DROP TABLE IF EXISTS songs CASCADE;
-- CREATE TABLE songs(
--     song_id NUMERIC PRIMARY KEY,
--     song_name VARCHAR(100) NOT NULL,
--     song_artist VARCHAR(100) NOT NULL,
--     song_length NUMERIC NOT NULL
-- );
--
-- INSERT INTO songs (song_id, song_name, song_artist, song_length) VALUES
-- (01,'Bad Liar', 'Imagine Dragons', 4:00),
-- (01,'Salt', 'Ava Max', 3:30),
-- (03,'Flowers', 'Miley Cyrus', 3:00),
-- (04,'Party Monster', 'The Weeknd', 4:30);
--
-- DROP TABLE IF EXISTS user_song;
-- CREATE TABLE user_song(
--     user_id INTEGER NOT NULL REFERENCES users (user_id),
--     song_id INTEGER NOT NULL REFERENCES songs (song_id)
-- );
--
-- INSERT INTO user_song (user_id, song_id) VALUES
-- (1,01),(1,02),(1,03),(1,04),(2,01),(2,02),(2,03),(2,04),(3,01),(3,02),(3,03),(3,04),(4,01),(4,02),(4,03),(4,04);