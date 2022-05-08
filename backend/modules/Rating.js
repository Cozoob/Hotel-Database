const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    roomID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Rating', ratingSchema);