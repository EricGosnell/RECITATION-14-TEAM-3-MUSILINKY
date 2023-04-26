DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS users_to_playlists CASCADE;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL
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
