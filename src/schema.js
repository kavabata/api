
const { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type DhtGraph {
    deviceId: String
    temperature: String
    humidity: String
    created: String
  }
  type Device {
    id: String
    name: String
    status: String
  }
  type Query {
    hello: String
    avgTemperature: String
    getDht(deviceId: String, zoom: String, startDate: String, endDate: String): [DhtGraph]
    getDevice(deviceId: String): [Device]
  }
  type Mutation {
    dht(key: String!, temperature: String!, humidity: String!): String!
    dhtInsert(key: String!, temperature: String!, humidity: String!): String!
  }
`);

module.exports = schema;