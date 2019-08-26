const mongoose = require('mongoose');

const Server = new mongoose.Schema({
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

module.exports = mongoose.model('Server', Server);

