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
            res.redirect('/login')
        })
        .catch((err) => {
            console.log(err);
            res.locals.message = "Registration failed.";
            res.render("pages/register");
        });
});

app.get("/login", (req, res) => {
    res.render("pages/login");
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

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.locals.message = 'Logged out.';
    res.render('pages/login');
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');