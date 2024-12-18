const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content:   { type: String, required: true },
  level:     { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
