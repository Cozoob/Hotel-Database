const mongoose = require('mongoose');
const Reservation = require('./Reservation');
const roleEnum = require('../enums/Role')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    roleID: {
        type: Number,
        default: roleEnum.CLIENT_ID
    },
    reservations: [
        {
            reservation: {
                type: mongoose.Schema.ObjectId,
                ref: 'Reservation'
            }
        }

    ]
});

module.exports = mongoose.model('User', userSchema);