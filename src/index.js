// src/index.js
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require('./schema');
const resolvers = require("./resolvers");
const config = require("./config");

const initDb = require("./db").initDb;
initDb(() => {});

const app = express();
const cors = require('cors');
app.use(cors())

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);
app.listen(config.app.port);

console.log(`🚀 Server ready at http://localhost:${config.app.port}/graphql`);