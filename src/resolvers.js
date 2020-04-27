
var dht = require('./models/dht');
var device = require('./models/device');
var pir = require('./models/pir');
var light = require('./models/light');
var switchstate = require('./models/switch');

// const getDb = require("./db").getDb;

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

module.exports = resolvers;
