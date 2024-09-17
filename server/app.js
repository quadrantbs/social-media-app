const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const context = ({ req }) => {
//   const token = req.headers.authorization || "";
//   if (token) {
//     const user = jwt.verify(token, process.env.JWT_SECRET);
//     return { user };
//   }
//   return {};
// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  //   context,
});

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 4000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
