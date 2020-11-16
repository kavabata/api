
import { buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
export const schema = buildSchema(`
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
  type Config {
    key: String
    value: String
  }
  type Query {
    hello: String
    avgTemperature: String
    getDht(deviceId: String, zoom: String, startDate: String, endDate: String): [DhtGraph]
    getDevice(deviceId: String): [Device]
    getConfig(key: String!): [Config]
  }
  type Mutation {
    dht(key: String!, temperature: String!, humidity: String!): String!
    dhtInsert(key: String!, temperature: String!, humidity: String!): String!
    pir(key: String!, state: String): String!
    light(key: String!, level: String): String!
    switch(key: String!, state: String): String!

    configValue(key: String!, name: String!, value: String!): String!
    sensorValue(key: String!, sensorType: String!, value: String!): String!
    
    controllerCall(key: String!, controller: String!, value: String!): String!
    fireController(key: String!, controller: String!, action: String!): String!
  }
`);
export default schema;