
var dht = require('./models/dht');
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
  getDht: async ({ dateStart, dateEnd, zoom, deviceId }) => dht.getDhtList({ dateStart, dateEnd, zoom, deviceId }),
  getDevice: async({ deviceId }) => device.getDevice({ deviceId }),  
  sensorValue: async({ key, sensorType, value }) => sensors.insertSensorValueByKey({ key, sensorType, value }),

  controllerCall: async({ key, controller, action }) => {
    console.log('controllerCall');
    console.log('-----------ip: ' + key);
    console.log('---controller: ' + controller);
    console.log('-------action: ' + action);
    return await controllers.setControllerState({ key, controller, action });
  },
  
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
