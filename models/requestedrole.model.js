const mongoose = require('mongoose');

const Requestedrole = new mongoose.Schema({
    server: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        trim: true
    }
}, {
        timestamps: true,
    });

module.exports = mongoose.model('Requestedrole', Requestedrole);

