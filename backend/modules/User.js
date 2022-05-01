const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        uique: true,
        dropDups: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    passwordHash:{
        type: String,
        required: true,
        select: false
    },
    roleID:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);