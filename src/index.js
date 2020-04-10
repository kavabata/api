// src/index.js
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require('./schema');

const initDb = require("./db").initDb;
const getDb = require("./db").getDb;

initDb(() => {});
var dht = require('./dht');
var device = require('./device');

// Provide resolver functions for your schema fields
const resolvers = {
  hello: () => "Hello world!",
  avgTemperature: () => {
    return '36.6';
  },
  getDht: async ({ dateStart, dateEnd, zoom, deviceId }) => dht.getDhtList({ dateStart, dateEnd, zoom, deviceId }),
  dht:  async ({ key, temperature, humidity }, context) => dht.insertDhtByKey({ key, temperature, humidity }),
  getDevice: async({ deviceId }) => device.getDevice({ deviceId })
};

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
app.listen(4000);

console.log(`🚀 Server ready at http://localhost:4000/graphql`);