// Before we installed passport with 'npm install --save passport passport-local'

// Here we import stuff that we need for app
const LocalStrategy = require('passport-local').Strategy;
// Importing model 'user.js' from  'models' folder
const User = require('../models/user');
// Importing database 'database.js' from folder 'config'
const config = require('../config/database');
// Adding bcriptjs for hashing password that we instaled with 'npm install --save bcryptjs'
const bcrypt = require('bcryptjs');


// Exporting so it can be used outside of this file
module.exports = (passport) => {
    // Adding LocalStrategy imported above 
    passport.use(new LocalStrategy((username, password, done) => {
        // Bellow we match username
        let query = {username: username};
        // Here we check if there is one user
        User.findOne(query, (err, user) => {
            // If there is error we throw it
            if(err) throw err;
            // if there is no user we display this message
            if(!user) {
                return done(null, false, {message: 'No user found'});
            }

            // Bellow we match the password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                // If there is error we throw it
                if(err) throw err;
                // Checking 'isMatch' value - If it is true we return that user
                if(isMatch) {
                    return done(null, user);
                } else {
                    // if user don't match we display this message
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));

    // This functions are added here as obligatin and from 'passport.js' documentation page 
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}