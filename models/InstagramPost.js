// models/InstagramPost.js
const mongoose = require('mongoose');

const InstagramPostSchema = new mongoose.Schema({
  image: { type: String, required: true },
  link: { type: String,required:true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.InstagramPost || mongoose.model('InstagramPost', InstagramPostSchema);