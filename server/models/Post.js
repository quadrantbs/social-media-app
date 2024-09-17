const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
}, { timestamps: true });

const likeSchema = new mongoose.Schema({
  username: { type: String, required: true },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  tags: [String],
  imgUri: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
  likes: [likeSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
