
module.exports = {
  sensorTrigger: async ({ sensorId, roomId, value }) => {

    // const sensorsState = await require('../models/sensors').getSensorsState(roomId);
    // console.log(sensorsState);

    const scenarios = await require('../models/scenarios').getScenario();
    // console.log(scenarios);
    // console.log(sensorId);
  
    let actions = [];
    const touchedControllers = scenarios
      .filter(({ sensor_id }) => sensor_id == sensorId)
      .map(({ controller_id, device_id, type }) => ({ controllerId: controller_id, deviceId: device_id, controller: type }));
    
    // console.log(touchedControllers);

    touchedControllers.forEach(({ controllerId, deviceId, controller }) => {
      const controllerList = scenarios
        .filter(({ controller_id }) => controller_id == controllerId )
      
      // console.log(controllerList);
      
      if (controllerList.every(({ checked }) => checked)) {
        const action = controllerList.reduce((acc, { controller_value }) => controller_value, 0);

        // console.log('console.log(callAction);');
        // console.log(deviceId);
        // console.log(controller);
        // console.log(action);

        require('./call').fireCallToDevice({ deviceId, controller, action});
      }

    });
  }
};
