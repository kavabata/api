import { insertSensorValueByKey, insertControllerValueByKey } from './sensors';
import { saveDeviceConfig } from './devices';

const resolvers = {
  hello: () => "Hello world!",
  avgTemperature: () => {
    return '36.6';
  },
  // getConfig: async({ key }, context) => device.getConfig(key),
  // getDevice: async({ deviceId }) => device.getDevice({ deviceId }),
  configValue: saveDeviceConfig,
  sensorValue: insertSensorValueByKey,
  controllerCall: insertControllerValueByKey
  // controllerCall: async({ key, controller, action }) => controllers.setControllerState({ key, controller, action }),
  // fireController: async({ key, controller, action, delay = 0 }) => controllers.fireController({ key, controller, action, delay })
};

export default resolvers;
