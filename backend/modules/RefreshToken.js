const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        dropDups: true
    },
    refreshToken:{
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    expDate:{
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);