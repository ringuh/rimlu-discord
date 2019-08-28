const mongoose = require('mongoose');

const Role = new mongoose.Schema({
    server: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    admin: {
        type: String,
        trim: true
    },
    channel: { 
        type: String,
        trim: true
    },
}, {
        timestamps: true,
    });

module.exports = mongoose.model('Role', Role);

