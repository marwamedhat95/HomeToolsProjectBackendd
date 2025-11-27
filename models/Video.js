const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['file', 'youtube', 'facebook'], required: true },
  url: { type: String },
  filename: { type: String },
  category: { 
    type: String,
    required: true,
    enum: ['bathroom', 'kitchen', 'furniture', 'kids']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
