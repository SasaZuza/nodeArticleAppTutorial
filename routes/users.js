// Express instaled with 'npm install --save express'
const express = require('express');
// Creating variable and seting it equal to express router
const router = express.Router();
// Adding bcriptjs for hashing password that we instaled with 'npm install --save bcryptjs'
const bcrypt = require('bcryptjs');
// Adding passport
const passport = require('passport');


// Bringing up 'user.js' from 'models' folder
let User = require('../models/user');


// Creating another route for adding register form to app
router.get('/register', (req, res) => {
    // Displaying 'register.pug' file from 'views' folder
    res.render('register');
});


// Register proccess for the form added in 'register.pug' file
router.post('/register', (req, res) => {
    // Adding options that inputs are required for those fields
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    // Seting how input fields need to be filled in
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Pasword do no match').equals(req.body.password);
    
    // If there are errors with adding input geting them here
        let errors = req.validationErrors();

    // Checking for errors
    if(errors) {
        // If there are errors rirender template and pass that errors there
        res.render('register', {
            errors: errors
        });
        // If there is no errors add new user
    } else {
        let newUser = new User ({
            name: name,
            email: email,
            username: username,
            password: password
        });

        // With this function we getSalt - we define how much caracters it has
        bcrypt.genSalt(10, (err, salt) => {
            // With this we hash password for new user we create for app
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                // Checking if there is error
                if(err) {
                    console.log(err);                    
                }
                // Converting entered password as plain text to password with hash
                newUser.password = hash;
                // Adding save function that saves that hashed password for new user
                newUser.save((err) => {
                    // Checking if there is error
                    if(err) {
                        console.log(err);
                        return;
                    // If there is no errors flash this message bellow                     
                    } else {                        
                        req.flash('success', 'You are registred as new user and can log in to app');
                        // After that we redirect to this page
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});


// Here we get this 'login' route for form
router.get('/login', (req, res) => {
    res.render('login');
});


// This is where we deal with login process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});


// Here we deal with logout process
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});


// Exporting router so it can be used from outside 
module.exports = router;