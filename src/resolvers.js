var device = require('./models/device');
var sensors = require('./models/sensors');
var controllers = require('./models/controllers');

// const getDb = require("./db").getDb;

// Provide resolver functions for your schema fields
const resolvers = {
  hello: () => "Hello world!",
  avgTemperature: () => {
    return '36.6';
  },

  getDevice: async({ deviceId }) => device.getDevice({ deviceId }),  
  sensorValue: async({ key, sensorType, value }) => sensors.insertSensorValueByKey({ key, sensorType, value }),
  controllerCall: async({ key, controller, action }) => controllers.setControllerState({ key, controller, action }),
  
  getConfig: async({ key }, context) => {
    return [
      {
        key: 'test',
        value: 'var'
      }
    ]
  }
};

module.exports = resolvers;
