// Importing mongoose installed with 'npm install --save mongoose'
const mongoose = require('mongoose');

// users schema - defines properties for the login of users
let UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    },  
});

// Creating variable to export so we can use this model outside of this file
let User = module.exports = mongoose.model('User', UserSchema);