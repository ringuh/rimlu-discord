const mongoose = require('mongoose');

const Record = new mongoose.Schema({
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
  media: { 
    type: String,
    trim: true
  },
  user_class: { type: String },

  last_login: { type: Date, required: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Record', Record);

