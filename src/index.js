// src/index.js
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require('./schema');

const initDb = require("./db").initDb;
const getDb = require("./db").getDb;

initDb(() => {});
var dht = require('./dht');
var device = require('./device');
var pir = require('./pir');
var light = require('./light');
var switchstate = require('./switch');

// Provide resolver functions for your schema fields
const resolvers = {
  hello: () => "Hello world!",
  avgTemperature: () => {
    return '36.6';
  },
  getDht: async ({ dateStart, dateEnd, zoom, deviceId }) => dht.getDhtList({ dateStart, dateEnd, zoom, deviceId }),
  dht:  async ({ key, temperature, humidity }, context) => dht.insertDhtByKey({ key, temperature, humidity }),
  getDevice: async({ deviceId }) => device.getDevice({ deviceId }),
  pir:  async ({ key, state }, context) => pir.insertPirByKey({ key, state }),
  light:  async ({ key, level }, context) => light.insertLightByKey({ key, level }),
  switch:  async ({ key, state }, context) => switchstate.insertSwitchByKey({ key, state }),
  getConfig: async({ key }, context) => {
    return [
      {
        key: 'test',
        value: 'var'
      }
    ]
  }
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