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
        type: String,
        required: true
    },
    numberOfDays: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Reservation', reservationSchema)