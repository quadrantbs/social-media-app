const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
  }

  type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String!
    createdAt: String
  }

  type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
  }

  type Query {
    login(username: String!, password: String!): String
    getUser(id: ID!): User
    getPost(id: ID!): Post
    searchUser(username: String!): [User]
  }

  type Mutation {
    register(
      name: String!
      username: String!
      email: String!
      password: String!
    ): User
    addPost(content: String!, tags: [String], imgUrl: String): Post
    commentPost(postId: ID!, content: String!): Post
    likePost(postId: ID!): Post
    follow(followingId: ID!): Follow
  }
`;

module.exports = typeDefs;
