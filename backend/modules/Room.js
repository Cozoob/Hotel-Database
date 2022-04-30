const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    imageLink:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Room', roomSchema);