const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleID:{
        type: Int32,
        required: true,
        unique: true,
        dropDups: true
    },
    name:{
        type: String,
        required: true,
        unique: true,
        dropDups: true
    }
});

module.exports = mongoose.model('Role', roleSchema);