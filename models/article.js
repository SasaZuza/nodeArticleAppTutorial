// Importing mongoose installed with 'npm install --save mongoose'
const mongoose = require('mongoose');

// Article schema - defines properties for the database
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
});

let Article = module.exports = mongoose.model('Article', articleSchema);