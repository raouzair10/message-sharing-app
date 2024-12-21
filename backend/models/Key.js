const mongoose = require('mongoose');

const KeySchema = new mongoose.Schema({
  level: { type: Number, unique: true, required: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
});

module.exports = mongoose.model('Key', KeySchema);