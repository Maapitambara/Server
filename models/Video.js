const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String },
});

module.exports = mongoose.model('Video', videoSchema);
