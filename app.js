// Importing modules that we will use in our app
// Express instaled with 'npm install --save express'
const express = require('express');
// Path importing and seting up
const path = require('path');
// Importing mongoose installed with 'npm install --save mongoose'
const mongoose = require('mongoose');
// Importing body-parse installed with 'npm install --save body-parser'
const bodyParser = require('body-parser');
// Importing express-validator installed with 'npm install --save express-validator'
const expressValidator = require('express-validator');
// Importing connect flash installed with 'npm install --save connect-flash'
const flash = require('connect-flash');
// Importing express session installed with 'npm install --save express-session'
const session = require('express-session');
// Importing passport installed with 'npm install --save passport passport-local'
const passport = require('passport');
// Importing 'database.js' file from 'config' folder
const config = require('./config/database');


// Connecting mongoose to our datbase with 'database.js' file in 'config' folder
mongoose.connect(config.database);
let db = mongoose.connection;


// Check connection with database
db.once('open', () => {
    console.log('Connected to MongoDB!');
});


// Checking errors in database
db.on('error', (err) => {
    console.log(err);
});


// Assigning variable to express
const app = express();


// Bringing up 'article.js' from 'models' folder
let Article = require('./models/article');

// Loading view engine by seting folder where views will be stored
app.set('views', path.join(__dirname, 'views'));
// After that we seting up view engine to 'pug'
app.set('view engine', 'pug');


// Setting up body-parsor middleware
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());


// Seting up 'public' folder as static folder for our app
app.use(express.static(path.join(__dirname, 'public')));


// Seting express session middleware instaled with 'npm install --save express-session'
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true    
  }));


// Seting express messages middleware instaled with 'npm install --save express-messages'
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Setting express validator middleware installed with 'npm install --save express-validator'
app.use(expressValidator());


// Here we add Passport Config
require('./config/passport')(passport);

// Adding Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Creating global variable for all routes if there is logged user to app
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


// Creating route for app - home route
app.get('/', (req, res) => {    
    /*
    // For now we create array of articles here (later they will be in mongoDB)
    let articles = [
        {
            id: 1,
            title: 'Article One',
            author: 'Sasa Zuza',
            body: 'This is article one'
        },
        {
            id: 2,
            title: 'Article Two',
            author: 'Jovana Zuza',
            body: 'This is article two'
        }, 
        {
            id: 3,
            title: 'Article three',
            author: 'John Doe',
            body: 'This is article three'
        },  
    ];
    */

    // Displaying simple message
    // res.send('Hello World');

    // Using article model variable
    Article.find({}, (err, articles) => {
        // Checking for errors and if there are errors console log them
        if(err){
            console.log(err);
        } else {
            // Displaying 'index.pug' file from 'views' folder
            res.render('index', {
                title: 'Articles',
                // Here we add articles array created above
                articles: articles
        });
        }        
    });    
});


// Bring route files
let articles = require('./routes/articles');
let users = require('./routes/users');
// Everything that has in routes 'articles' word go to that file
app.use('/articles', articles);
// Everything that has in routes 'users' word go to that file
app.use('/users', users);


// Seting up listen function for port of our app
app.listen(3000, ()=>{
    console.log('Server started on port 3000...')
});