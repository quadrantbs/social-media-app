const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { Post } = require("../models/Post");
const {Follow} = require("../models/Follow");

const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("Incorrect password");
      }
      return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    },
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
    getPosts: async () => {
      return await Post.findAll();
    },
    getPost: async (_, { id }) => {
      return await Post.findById(id);
    },
    searchUser: async (_, { username }) => {
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
    addPost: async (
      _,
      { content, tags, imgUrl },
    //   {user} 
    ) => {
      //   if (!user) throw new Error("You must be logged in to post");
      if (!content) {
        throw new Error("Content is required");
      }
      const post = {
        content,
        tags,
        imgUrl,
        comments: [],
        likes: [],
        // authorId: user.id
        authorId: "66e96e92811fb72da0b1e34b",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await Post.createPost(post);
      return { _id: result.insertedId, ...post };
    },
    commentPost: async (_, { postId, content }, 
        // { user }
    ) => {
        const comment = {
            content, 
            // username: user.username 
            username: "okattako",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
      const post = await Post.commentPost(postId, comment);
      if (!post) throw new Error("Post not found");
      return post;
    },
    likePost: async (_, { postId }, 
        // { user }
    ) => {
        const newLike = {
            // username: user.username 
            username: "okattako",
            createdAt: new Date().toISOString(),
        }
        const alreadyLiked = (await Post.findById(postId)).likes.some(like=> like.username ===newLike.username)
        if (alreadyLiked) {
            throw new Error ("User has already liked this post")
        }
      const post = await Post.likePost(postId, newLike);
      if (!post) throw new Error("Post not found");
      return post;
    },
    follow: async (_, { followingId }, 
        // { user }
    ) => {
        if (followingId==="66e96e92811fb72da0b1e34b") {
            throw new Error("Cannot follow your own account")
        }
        const existingFollow = await Follow.findOne(followingId, 
            followerId= "66e96e92811fb72da0b1e34b")
            if (existingFollow) {
               const result = await Follow.unFollow(followingId, 
                followerId= "66e96e92811fb72da0b1e34b")
                console.log(result)
                return { _id: "Deleted", followingId, followerId };
            }  
      const result = await Follow.createFollow(
        followingId, 
        followerId= "66e96e92811fb72da0b1e34b",
        // followerId: user.id 
    );
      return { _id: result.insertedId, followingId, followerId };
    },
  },
};

module.exports = resolvers;
