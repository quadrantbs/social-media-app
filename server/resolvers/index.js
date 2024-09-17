const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');

const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error('Incorrect password');
      }
      return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    },
    getUser: async (_, { id }) => {
      return User.findById(id);
    },
    getPost: async (_, { id }) => {
      return Post.findById(id).populate('authorId');
    },
    searchUser: async (_, { username }) => {
      return User.find({ username: new RegExp(username, 'i') });
    }
  },
  Mutation: {
    register: async (_, { name, username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, username, email, password: hashedPassword });
      return user.save();
    },
    addPost: async (_, { content, tags, imgUri }, { user }) => {
      if (!user) throw new Error('You must be logged in to post');
      const post = new Post({ content, tags, imgUri, authorId: user.id });
      return post.save();
    },
    commentPost: async (_, { postId, content }, { user }) => {
      const post = await Post.findById(postId);
      if (!post) throw new Error('Post not found');
      post.comments.push({ content, username: user.username });
      return post.save();
    },
    likePost: async (_, { postId }, { user }) => {
      const post = await Post.findById(postId);
      if (!post) throw new Error('Post not found');
      post.likes.push({ username: user.username });
      return post.save();
    },
    follow: async (_, { followingId }, { user }) => {
      const follow = new Follow({ followingId, followerId: user.id });
      return follow.save();
    }
  }
};

module.exports = resolvers;
