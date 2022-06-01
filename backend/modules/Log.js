const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }

});

module.exports = mongoose.model('Log', logSchema);