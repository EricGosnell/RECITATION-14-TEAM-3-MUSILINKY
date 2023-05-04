-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS playlists CASCADE;
-- DROP TABLE IF EXISTS connections CASCADE;
-- DROP TABLE IF EXISTS users_to_playlists CASCADE;
-- DROP TABLE IF EXISTS communities CASCADE;
-- DROP TABLE IF EXISTS users_to_communities CASCADE;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL NOT NULL,
    username VARCHAR(50) PRIMARY KEY NOT NULL,
    password CHAR(60) NOT NULL,
    bio VARCHAR (250)
);

CREATE TABLE IF NOT EXISTS connections (
    user1_id INT NOT NULL,
    user2_id INT NOT NULL
);


CREATE TABLE IF NOT EXISTS songs(
    song_id SERIAL PRIMARY KEY NOT NULL,
    song_name VARCHAR(100) NOT NULL,
    song_artist VARCHAR(100),
    song_album VARCHAR(100),
    song_preview TEXT,
    song_link TEXT
);

CREATE TABLE IF NOT EXISTS user_playlist(
    song_id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(50) REFERENCES users (username),
    song_name VARCHAR(100) NOT NULL,
    song_artist VARCHAR(100),
    song_album VARCHAR(100),
    song_preview TEXT,
    song_link TEXT
);

CREATE TABLE IF NOT EXISTS communities(
    community_id SERIAL PRIMARY KEY NOT NULL,
    community_name VARCHAR(50) NOT NULL,
    community_owner VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS communities_users(
    username VARCHAR(50) NOT NULL,
    community_name VARCHAR(50) NOT NULL
);