const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const jwt = require("jsonwebtoken");

const context = ({ req }) => {
  const token = (req.headers.authorization)?.split(" ")[1] || "";
  if (token) {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return { user };
  }
  return {};
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
