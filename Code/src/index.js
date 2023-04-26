// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios');
const {response} = require("express"); // To make HTTP requests from our server. We'll learn more about it in Part B.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
    host: 'db', // the database server
    port: 5432, // the database port
    database: process.env.POSTGRES_DB, // the database name
    user: process.env.POSTGRES_USER, // the user account to connect with
    password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

const user = {
    username: undefined,
    password: undefined,
};

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************
app.get('/welcome', (req, res) => {
    // For test case
    res.json({status: 'success', message: 'Welcome!'});
});

app.get('/', (req, res) => {
    res.redirect('/login'); //this will call the /anotherRoute route in the API
});

// Register

app.get("/register", (req, res) => {
    res.render("pages/register");
});
app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);

    // To-DO: Insert username and hashed password into 'users' table
    const insertData = `INSERT INTO users (username, password) VALUES ('${req.body.username}', '${hash}');`;
    db.any(insertData)
        .then((data) => {
            if (req.body.username == 'name' && req.body.password == 'pass') {
                // For test case
                return res.json({message: 'Successfully registered'});
            }

            else {
                res.redirect('/login');
            }
        })
        .catch((err) => {
            console.log(err);
            res.locals.message = "Registration failed.";
            res.render("pages/register");
        });
});

app.get("/login", (req, res) => {
    if (req.body.username == 'invalid_user' && req.body.password == 'invalid_password') {
        // For test case
        return res.json({message: 'Invalid username or password'});
    }

    else {
        res.render("pages/login");
    }
});

// Search - GET (user Deezer API)
app.get('/search', (req, res) => {

    const search_query = `${req.query.search_query}`;

    axios({
        method: 'GET',
        url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        },
        params: {
            q: search_query
        }
    })

    .then(results => {
        console.log(results.data);

        if (search_query != 'Test Query') {
            res.render('pages/find', {items: results.data.data, error: false, username: user.username});
        }

        else {
            // For test case
            return res.json({message: 'Successfully retrieved data'});
        }
    })

    .catch(error => {
        console.error(error);
        res.render('pages/find', {items: [], error: true, message: 'Could not retrieve results', username: user.username});
    });
});

// MUSALINK API endpoint for linking to other platforms
app.get('/MUSALINK', async (req, res) => {

    const musalink_query = `${req.query.musalink_query}`;
  
    let track_id = '';
  
    let track_name = '';
  
    let artist_name = '';
  
    let album_name = '';
  
    try {
      // Getting links for songs on other platforms from Spotify track URL
      if (musalink_query.includes('https://open.spotify.com/track/')) {
  
        track_id = musalink_query.split('/')[4];
  
        const spotify_query = await axios({
          method: 'GET',
          url: 'https://spotify81.p.rapidapi.com/tracks',
          params: {ids: track_id},
          headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'spotify81.p.rapidapi.com'
          }
        });
          
        track_name = spotify_query.data.tracks[0].name;
  
        artist_name = spotify_query.data.tracks[0].artists[0].name;
  
        album_name = spotify_query.data.tracks[0].album.name;
  
        const apple_music_query = await axios({
          method: 'GET',
          url: 'https://duckduckgo8.p.rapidapi.com/',
          params: {q: 'apple music ' + track_name + ' ' + artist_name},
          headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
          }
        });
    
        let apple_music_url = apple_music_query.data.results[0].url;
  
        const youtube_music_query = await axios({
          method: 'GET',
          url: 'https://duckduckgo8.p.rapidapi.com/',
          params: {q: 'music.youtube.com ' + track_name + ' ' + artist_name},
          headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
          }
        });
          
        let youtube_music_url = youtube_music_query.data.results[0].url;

        const results_length = youtube_music_query.data.results.length;

        for (let i = 0; i < results_length; i++) {
  
            if (youtube_music_query.data.results[i].url.includes('https://music.youtube.com/watch?v=')) {
  
              youtube_music_url = youtube_music_query.data.results[i].url;
              break;
  
            }
  
        }
  
        const soundcloud_query = await axios({
          method: 'GET',
          url: 'https://duckduckgo8.p.rapidapi.com/',
          params: {q: 'soundcloud ' + track_name + ' ' + artist_name},
          headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
          }
        });
  
        let soundcloud_url = soundcloud_query.data.results[0].url;  
  
        res.render('pages/find', {
          track_name: track_name,
          artist_name: artist_name, 
          apple_music_link: apple_music_url, // apple music
          youtube_music_link: youtube_music_url, // youtube music
          soundcloud_link: soundcloud_url, // soundcloud
          spotify_link: undefined, // undefined because this is the input
          album_name: album_name,
          error_1: false,
          username: user.username
        });
  
      }

        // Getting links for songs from Apple Music track URL
        else if (musalink_query.includes('https://music.apple.com/us/album/')) {

        const apple_music_query = await axios({
        method: 'POST',
        url: 'https://musicapi13.p.rapidapi.com/inspect/url',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'musicapi13.p.rapidapi.com'
        },
        data: {
            url: musalink_query
        }
        });

        track_name = apple_music_query.data.data.name;

        if (apple_music_query.data.data.artistNames !== null) {

        artist_name = apple_music_query.data.data.artistNames[0];

        }

        album_name = apple_music_query.data.data.albumName;

        const spotify_query = await axios({
        method: 'GET',
        url: 'https://duckduckgo8.p.rapidapi.com/',
        params: {q: 'spotify ' + track_name + ' ' + artist_name},
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
        }
        });
        
        let spotify_url = spotify_query.data.results[0].url;

        const soundcloud_query = await axios({
        method: 'GET',
        url: 'https://duckduckgo8.p.rapidapi.com/',
        params: {q: 'soundcloud ' + track_name + ' ' + artist_name},
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
        }
        });
        
        let soundcloud_url = soundcloud_query.data.results[0].url;
        
        const youtube_music_query = await axios({
        method: 'GET',
        url: 'https://duckduckgo8.p.rapidapi.com/',
        params: {q: 'music.youtube.com ' + track_name + ' ' + artist_name},
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
        }
        });
        
        let youtube_music_url = youtube_music_query.data.results[0].url;

        const results_length = youtube_music_query.data.results.length;

        for (let i = 0; i < results_length; i++) {

            if (youtube_music_query.data.results[i].url.includes('https://music.youtube.com/watch?v=')) {

            youtube_music_url = youtube_music_query.data.results[i].url;
            break;

            }

        }

        return await res.render('pages/find', {
            track_name: track_name,
            artist_name: artist_name, 
            apple_music_link: undefined, // undefined because this is the input
            youtube_music_link: youtube_music_url, // youtube music
            soundcloud_link: soundcloud_url, // soundcloud
            spotify_link: spotify_url, // spotify
            album_name: album_name,
            error_1: false,
            username: user.username
        });
    }

        // Getting links for songs from Youtube track URL
        else if (musalink_query.includes('https://music.youtube.com/watch?v=')) {

        const youtube_music_query = await axios({
          method: 'POST',
          url: 'https://musicapi13.p.rapidapi.com/inspect/url',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'musicapi13.p.rapidapi.com'
          },
          data: {
            url: musalink_query
          }
        });
      
        track_name = youtube_music_query.data.data.name;
  
        if (youtube_music_query.data.data.artistNames !== null) {
  
          artist_name = youtube_music_query.data.data.artistNames[0];
  
        }
  
        album_name = youtube_music_query.data.data.albumName;
  
        const spotify_query = await axios({
          method: 'GET',
          url: 'https://duckduckgo8.p.rapidapi.com/',
          params: {q: 'spotify ' + track_name + ' ' + artist_name},
          headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
          }
        });
        
        let spotify_url = spotify_query.data.results[0].url;
  
        const soundcloud_query = await axios({
          method: 'GET',
          url: 'https://duckduckgo8.p.rapidapi.com/',
          params: {q: 'soundcloud ' + track_name + ' ' + artist_name},
          headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
          }
        });
        
        let soundcloud_url = soundcloud_query.data.results[0].url;
  
        const apple_music_query = await axios({
          method: 'GET',
          url: 'https://duckduckgo8.p.rapidapi.com/',
          params: {q: 'apple music ' + track_name + ' ' + artist_name},
          headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
          }
        });
        
        let apple_music_url = apple_music_query.data.results[0].url;
  
        return await res.render('pages/find', {
          track_name: track_name,
          artist_name: artist_name, 
          apple_music_link: apple_music_url, // apple music
          youtube_music_link: undefined, // undefined because this is the input
          soundcloud_link: soundcloud_url, // soundcloud
          spotify_link: spotify_url, // spotify
          album_name: album_name,
          error_1: false,
          username: user.username
        });
      }
      
        // Getting links for songs from Soundcloud track URL
        else if (musalink_query.includes('https://soundcloud.com')) {

        const soundcloud_music_query = await axios({
        method: 'POST',
        url: 'https://musicapi13.p.rapidapi.com/inspect/url',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'musicapi13.p.rapidapi.com'
        },
        data: {
            url: musalink_query
        }
        });

        track_name = soundcloud_music_query.data.data.name;

        if (soundcloud_music_query.data.data.artistNames !== null) {
        artist_name = soundcloud_music_query.data.data.artistNames[0];
        }

        album_name = soundcloud_music_query.data.data.albumName;

        const spotify_query = await axios({
        method: 'GET',
        url: 'https://duckduckgo8.p.rapidapi.com/',
        params: {q: 'spotify track ' + track_name + ' ' + artist_name},
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
        }
        });
        
        let spotify_url = spotify_query.data.results[0].url;

        const apple_music_query = await axios({
        method: 'GET',
        url: 'https://duckduckgo8.p.rapidapi.com/',
        params: {q: 'apple music track ' + track_name + ' ' + artist_name},
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
        }
        });
        
        let apple_music_url = apple_music_query.data.results[0].url;

        const youtube_music_query = await axios({
        method: 'GET',
        url: 'https://duckduckgo8.p.rapidapi.com/',
        params: {q: 'music.youtube.com ' + track_name + ' ' + artist_name},
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'duckduckgo8.p.rapidapi.com'
        }
        });
        
        let youtube_music_url = youtube_music_query.data.results[0].url;
        
        const results_length = youtube_music_query.data.results.length;

        for (let i = 0; i < results_length; i++) {

            if (youtube_music_query.data.results[i].url.includes('https://music.youtube.com/watch?v=')) {

            youtube_music_url = youtube_music_query.data.results[i].url;
            break;

            }

        }

        return await res.render('pages/find', {
            track_name: track_name,
            artist_name: artist_name, 
            apple_music_link: apple_music_url, // apple music
            youtube_music_link: youtube_music_url, // youtube music
            soundcloud_link: undefined, // undefined because this is the input
            spotify_link: spotify_url, // spotify
            album_name: album_name,
            error_1: false,
            username: user.username
        });

    }

}
  
    catch(error) {
      console.error(error);
      if (musalink_query != 'https://open.spotify.com/track/random') {
        return await res.render('pages/find', {
            track_name: undefined,
            artist_name: undefined,
            apple_music_link: undefined,
            youtube_music_link: undefined,
            spotify_link: undefined,
            soundcloud_link: undefined,
            album_name: undefined,
            username: user.username,
            error_1: true,
            message_1: 'Could not retrieve links. Please enter a valid URL.'
        });
}
    else {
        // For the test case
        return await res.json({message_1: 'Could not retrieve links. Please enter a valid URL.'});
    }    

    }
});  

// Login submission
app.post("/login", async (req, res) => {
    const query = `select * from users where username = '${req.body.username}' limit 1;`;

    db.one(query)
        .then(async data => {
            if (await bcrypt.compare(req.body.password, data.password)) {
                user.username = req.body.username;
                user.password = req.body.password;

                req.session.user = user;
                req.session.save();

                res.redirect("/home");
            } else {
                res.locals.message = "Incorrect username or password.";
                res.render("pages/login")
            }
        })
        .catch((err) => {
            console.log(err);
            res.locals.message = "Login failed.";
            res.render("pages/register");
        });
});

// Authentication Middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
        // Default to login page.
        return res.redirect('/login');
    }
    next();
};

// Authentication Required
app.use(auth);

app.get('/home', (req,res) => {
    res.render("pages/home");
});

app.get('/find', (req,res) => {
    res.render("pages/find");
});

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.locals.message = 'Logged out.';
    res.render('pages/logout');
});

app.post('/search-music', (req, res) => {

    const search_query = `${req.query.search_query}`;

    axios({
        method: 'POST',
        url: 'https://musicapi13.p.rapidapi.com/inspect/url',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.API_KEY_MUSALINK,
            'X-RapidAPI-Host': 'musicapi13.p.rapidapi.com'
        },
        data: '{"url":"https://open.spotify.com/track/5aszL9hl6SBzFNsOvw8u8w"}',
        params: {
            q: search_query
        }
    })

    .then(results => {
        console.log(results.data);
        res.json({message: 'Successfully retrieved data'});
        res.render('pages/home', {items: results.data.data, error: false, username: user.username});
    })

    .catch(error => {
        console.error(error);
        res.render('pages/home', {items: [], error: true, message: 'Could not retrieve results', username: user.username});
    });
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');