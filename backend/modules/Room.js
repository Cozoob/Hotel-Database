const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxAvailableNumber: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    imageLink: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Room', roomSchema);