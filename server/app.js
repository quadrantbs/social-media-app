const { ApolloServer } = require("@apollo/server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { verifyToken } = require("./helpers");
const { startStandaloneServer } = require("@apollo/server/standalone");

const context = ({ req }) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  // console.log(token,"SERVER TOKEN CONTEXT")
  return {
    verifyToken: () => {
      const user = verifyToken(token);
      if (!user) {
        throw new Error("Invalid token");
      }
      return { user };
    },
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context,
    listen: { port: 4000 },
  });

  console.log(`Server ready at ${url}`);
};

startServer();
