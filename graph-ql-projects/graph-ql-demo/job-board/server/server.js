import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";
import { resolvers } from "./resolvers.js";
import { getUser } from "./db/users.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

const typeDefs = await readFile("./schema.graphql", "utf8");

async function getContext({ req }) {
  // console.log("[getContext] req", req);
  // console.log("[getContext] req.auth", req.auth);
  if (req.auth) {
    const user = await getUser(req.auth.sub);
    return { user };
  }
  // if not auth return empty object
  return {};
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
// start apollo server
await apolloServer.start();
// apply middleware to a path - And with this, Express will send all requests for
// the "/graphql" path to the "apolloMiddleware",
app.use("/graphql", apolloMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
