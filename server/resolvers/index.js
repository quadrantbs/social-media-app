const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { Post } = require("../models/Post");
const { Follow } = require("../models/Follow");
const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT, 
  password: process.env.REDIS_PASS,
  db: 0,
});
const CACHE_KEY = 'takogram_posts_cache';

const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Incorrect username/password");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("Incorrect username/password");
      }
      return jwt.sign(
        { _id: user._id, name: user.name, username: user.username },
        process.env.JWT_SECRET
      );
    },
    getUser: async (_, { id }, { user }) => {
      if (!user) throw new Error("You must be logged in first");
      return await User.findById(id);
    },
    getPosts: async (_, __, { user }) => {
      if (!user) throw new Error("You must be logged in first");
      const cachedPosts = await redis.get(CACHE_KEY);
  
      if (cachedPosts) {
        console.log('Returning cached posts');
        return JSON.parse(cachedPosts);
      }
      
      console.log('Fetching posts from DB');
      const posts = await Post.findAll();
      
      await redis.set(CACHE_KEY, JSON.stringify(posts), 'EX', 3600);
    
      return posts;
    },
    getPost: async (_, { id }, { user }) => {
      if (!user) throw new Error("You must be logged in first");
      return await Post.findById(id);
    },
    searchUser: async (_, { username }, { user }) => {
      if (!user) throw new Error("You must be logged in first");
      return await User.searchUser(username);
    },
  },
  Mutation: {
    register: async (_, { name, username, email, password }) => {
      if (!username || !email || !password) {
        throw new Error("Username/Email/Password is required");
      }
      if (password.length < 5) {
        throw new Error("Password needs to be longer than 5 characters");
      }
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        throw new Error("Username already in use.");
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        throw new Error("Email already in use.");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        name,
        username,
        email,
        password: hashedPassword,
      };
      const result = await User.createUser(user);
      return { _id: result.insertedId, ...user };
    },
    addPost: async (_, { content, tags, imgUrl }, { user }) => {
      if (!user) throw new Error("You must be logged in first");
      if (!content) {
        throw new Error("Content is required");
      }
      let tagsArray = [];
      if (typeof tags === "string") {
        tagsArray = tags.split(",").map((tag) => tag.trim());
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
      const post = {
        content,
        tags: tagsArray,
        imgUrl,
        comments: [],
        likes: [],
        authorId: user._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await Post.createPost(post);
      await redis.del(CACHE_KEY);
      return { _id: result.insertedId, ...post };
    },
    commentPost: async (_, { postId, content }, { user }) => {
      if (!user) throw new Error("You must be logged in first");
      const comment = {
        content,
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const post = await Post.commentPost(postId, comment);
      if (!post) throw new Error("Post not found");
      return post;
    },
    likePost: async (_, { postId }, { user }) => {
      if (!user) throw new Error("You must be logged in first");
      const newLike = {
        username: user.username,
        createdAt: new Date().toISOString(),
      };
      const alreadyLiked = (await Post.findById(postId)).likes.some(
        (like) => like.username === newLike.username
      );
      if (alreadyLiked) {
        throw new Error("User has already liked this post");
      }
      const post = await Post.likePost(postId, newLike);
      if (!post) throw new Error("Post not found");
      return post;
    },
    follow: async (_, { followingId }, { user }) => {
      if (!user) throw new Error("You must be logged in first");
      if (followingId === user._id) {
        throw new Error("Cannot follow your own account");
      }
      const existingFollow = await Follow.findOne(
        followingId,
        (followerId = user._id)
      );
      if (existingFollow) {
        const result = await Follow.unFollow(
          followingId,
          (followerId = user._id)
        );
        console.log(result);
        return { _id: "Deleted", followingId, followerId };
      }
      const result = await Follow.createFollow(
        followingId,
        (followerId = user._id)
      );
      return { _id: result.insertedId, followingId, followerId };
    },
  },
};

module.exports = resolvers;
