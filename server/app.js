const { ApolloServer } = require("apollo-server");
const { ObjectId } = require("mongodb");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { verifyToken } = require("./helpers");

const context = ({ req }) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  return {
    verifyToken: () => {
      const user = verifyToken(token);
      if (!user) {
        throw new Error("Invalid token")
      }
      user._id = new ObjectId(String(user._id));
      return { user };
    },
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
