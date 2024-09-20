const { User } = require("../models/User");
const { Post } = require("../models/Post");
const { Follow } = require("../models/Follow");
const { ObjectId } = require("mongodb");
const Redis = require("ioredis");
const { generateToken, comparePassword, hashPassword } = require("../helpers");
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
  db: 0,
});
const CACHE_KEY = "takogram_posts_cache";

const resolvers = {
  Query: {
    getUser: async (_, { id }, { verifyToken }) => {
      verifyToken();
      return await User.findById(id);
    },
    getPosts: async (_, __, { verifyToken }) => {
      verifyToken();
      const cachedPosts = await redis.get(CACHE_KEY);

      if (cachedPosts) {
        console.log("Returning cached posts");
        return JSON.parse(cachedPosts);
      }

      console.log("Fetching posts from DB");
      const posts = await Post.findAll();

      await redis.set(CACHE_KEY, JSON.stringify(posts), "EX", 3600);

      return posts;
    },
    getPost: async (_, { id }, { verifyToken }) => {
      verifyToken();
      return await Post.findById(id);
    },
    searchUser: async (_, { username }, { verifyToken }) => {
      verifyToken();
      return await User.searchUser(username);
    },
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Incorrect username/password");
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        throw new Error("Incorrect username/password");
      }
      const access_token = generateToken(
        { _id: user._id, username: user.username },
        process.env.JWT_SECRET
      );
      return {
        access_token,
        _id: user._id,
        username: user.username,
      };
    },
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
      const hashedPassword = await hashPassword(password);
      const user = {
        name,
        username,
        email,
        password: hashedPassword,
      };
      const result = await User.createUser(user);
      return { _id: result.insertedId, ...user };
    },
    addPost: async (_, { content, tags, imgUrl }, { verifyToken }) => {
      const { user } = verifyToken();
      console.log(user.id);
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
        authorId: new ObjectId(String(user.id)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await Post.createPost(post);
      await redis.del(CACHE_KEY);
      return { _id: result.insertedId, ...post };
    },
    commentPost: async (_, { postId, content }, { verifyToken }) => {
      const { user } = verifyToken();
      const comment = {
        content,
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const post = await Post.commentPost(postId, comment);
      if (!post) throw new Error("Post not found");
      await redis.del(CACHE_KEY);
      return post;
    },
    likePost: async (_, { postId }, { verifyToken }) => {
      const { user } = verifyToken();
      const newLike = {
        username: user.username,
        createdAt: new Date().toISOString(),
      };
      const alreadyLiked = (await Post.findById(postId)).likes.some(
        (like) => like.username === newLike.username
      );
      let post;
      if (alreadyLiked) {
        console.log(user, " USER DISLIKING");
        post = await Post.dislikePost(postId, newLike);
        if (!post) throw new Error("Post not found");
      } else {
        console.log(user, " USER LIKING");
        post = await Post.likePost(postId, newLike);
        if (!post) throw new Error("Post not found");
      }
      await redis.del(CACHE_KEY);
      console.log(post)
      return post;
    },
    follow: async (_, { followingId }, { verifyToken }) => {
      const { user } = verifyToken();
      if (followingId === user.id) {
        throw new Error("Cannot follow your own account");
      }
      const followerId = user.id;
      console.log(followingId, "FOLLOWINGID");
      console.log(followerId, "FOLLOWERID");
      const existingFollow = await Follow.findOne(followingId, followerId);
      if (existingFollow) {
        const result = await Follow.unFollow(followingId, followerId);
        console.log(result);
        return { _id: "Deleted", followingId, followerId };
      }
      const result = await Follow.createFollow(followingId, followerId);
      return { _id: result.insertedId, followingId, followerId };
    },
  },
};

module.exports = resolvers;
