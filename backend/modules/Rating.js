const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    roomID:{
        type: String,
        required: true
    },
    userID:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Rating', ratingSchema);