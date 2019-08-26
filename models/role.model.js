const mongoose = require('mongoose');

const Role = new mongoose.Schema({
    serverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
    },
    name: {
        type: String,
        sparse: true,
        unique: true
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        trim: true
    },
    user_class: { type: String },
}, {
        timestamps: true,
    });

module.exports = mongoose.model('Role', Role);

