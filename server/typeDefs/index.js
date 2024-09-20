const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    followers: [User]
    following: [User]
  }

  type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    author: User!
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

  type LoginResponse {
  access_token: String
  _id: String
  username: String
}

  type Query {
    getUser(id: ID!): User
    getPosts: [Post]
    getPost(id: ID!): Post
    searchUser(username: String!): [User]
  }

  type Mutation {
    login(username: String!, password: String!): LoginResponse
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
