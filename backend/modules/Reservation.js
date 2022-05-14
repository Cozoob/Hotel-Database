const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room'
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    numberOfDays: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Reservation', reservationSchema)