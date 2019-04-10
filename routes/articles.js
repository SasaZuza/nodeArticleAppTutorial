// Express instaled with 'npm install --save express'
const express = require('express');

// Creating variable and seting it equal to express router
const router = express.Router();

// Bringing up 'article.js' from 'models' folder
let Article = require('../models/article');
// Bringing up 'user.js' from 'models' folder
let User = require('../models/user');


// Creating another route for adding articles to app
router.get('/add', ensureAuthenticated, (req, res) => {
    // Displaying 'add_article.pug' file from 'views' folder
    res.render('add_article', {
        title: 'Add article to app'
    });
});


// Adding submit route defined in 'add_article.pug' file
router.post('/add', (req, res) => {
    // Here we check if input field are empty when adding article - If they are we will display error
    req.checkBody('title', 'Title is required').notEmpty();
    // We commented this because we will on login automaticlly add user and autohor 
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // If there are errors with adding input geting them here
    let errors = req.validationErrors();

    // Checking if there is errors
    if(errors) {
        // If there are reload this template and pass errors that occured here
        res.render('add_article', {
            title: 'Add article to app',
            errors: errors
        });
    } else {
        // Creating variable that is connecting to 'Article' model
        let article = new Article();
        // Adding title, author and body from form that are inputed and submited
        article.title = req.body.title;
        // This is how we requested user by typing into input form name
        // article.author = req.body.author;
        // This is how we access it by using 'user' global variable and it's ID
        article.author = req.user._id;  
        article.body = req.body.body; 
        
        // Saving inputed values
        article.save((err) => {
            // If there is error we console log it 
            if(err) {
                console.log(err);
                return;
            // Else if there is no error we want to redirect to homepage
            } else {
                // Here we also addmessage that article is added with success
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }    
});


// Route for editing article by loading edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    // This is how we get articles by it's 'id'
    Article.findById(req.params.id, (err, article) => {
        // With this we prevent that user who is not author of article can't edit it (only author can)  
        if (article.author != req.user._id) {
            req.flash('danger', 'Not authorized');
            res.redirect('/');
        }
        // Displaying 'article.pug' file from 'views' folder
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});


// Adding submit route for update defined in 'edit_article.pug' file
router.post('/edit/:id', (req, res) => {
    // Creating variable that is equal to empty object
    let article = {};
    // Adding title, author and body from form that are inputed and submited to that object
    article.title = req.body.title;
    article.author = req.body.author;  
    article.body = req.body.body; 

    // Seting query that is equal to id of edited article
    let query = {_id:req.params.id}
    
    // Updating inputed values with usage of modal in this case
    Article.update(query, article, (err) => {
        // If there is error we console log it 
        if(err) {
            console.log(err);
            return;
        // Else if there is no error we want to redirect to homepage
        } else {
            // Here we also addmessage that article is added with success
            req.flash('success', 'Article Edited');            
            res.redirect('/');
        }
    });
});


// Creating route for deleting article
router.delete('/:id', (req, res) => {
    // First we check if user is logged in
    // If it's not logged in we send this '500' status which means error
    if(!req.user._id) {
        res.status(500).send();
    }

    // Seting query that is equal to id of deleted article
    let query = {_id:req.params.id}
    
    // Here we check is this article created by logged in user
    Article.findById(req.params.id, (err, article) => {
        // If it's not logged in we send this '500' status which means error
        if(article.author != req.user._id) {
            res.status(500).send();
        } else {
            // Deleting article with usisage of modal 'Article'
            Article.remove(query, (err) => {
                if(err) {
                    console.log(err);            
                }
                // Sending request that everything is ok with that process
                res.send('Success!');
            }); 
        }
    });    
});


// Route for geting single article
router.get('/:id', (req, res) => {    
    // This is how we get articles by it's 'id'
    Article.findById(req.params.id, (err, article) => {
        // Displaying author of article by it's ID
        User.findById(article.author, (err, user) => {
            // Displaying 'article.pug' file from 'views' folder and author with 'user' variable
            res.render('article', {
                article: article,
                author: user.name
            });        
        });
    });
});


// Access control - Only logged users can access some of the pages and links
function ensureAuthenticated (req, res, next) {
    // If user is authenticated go to this page
    if (req.isAuthenticated()) {
        return next();
    } else {
        // If not show this message and go to Login page
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}


// Exporting router so we can access it from outside
module.exports = router;