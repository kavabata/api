// var device = require('./models/device');
// var sensors = require('./models/sensors');
// var controllers = require('./models/controllers');
import sensors from './sensors';

const resolvers = {
  hello: () => "Hello world!",
  avgTemperature: () => {
    return '36.6';
  },
  // getConfig: async({ key }, context) => device.getConfig(key),
  // getDevice: async({ deviceId }) => device.getDevice({ deviceId }),

  sensorValue: sensors.insertSensorValueByKey
  // controllerCall: async({ key, controller, action }) => controllers.setControllerState({ key, controller, action }),
  // fireController: async({ key, controller, action, delay = 0 }) => controllers.fireController({ key, controller, action, delay })
};

export default resolvers;
