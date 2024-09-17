const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Follow', followSchema);
