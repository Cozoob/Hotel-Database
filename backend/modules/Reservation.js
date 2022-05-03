const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    rooms: [
        {
            room: {
                type: mongoose.Schema.ObjectId,
                ref: 'Room'
            },

            quantity: {
                type: Number,
                required: true
            }
        }
    ],
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