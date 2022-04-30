const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    roomID:{
        type: String,
        required: true
    },
    userID:{
        type: String,
        required: true
    }
});

reservationSchema.index({roomID: 1,userID: 1}, {unique: true});
module.exports = mongoose.model('Reservation', reservationSchema);