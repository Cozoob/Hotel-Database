const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true
    },
    rating: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('Rating', ratingSchema);