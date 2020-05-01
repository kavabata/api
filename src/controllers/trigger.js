
module.exports = {
  sensorTrigger: async ({ sensorId }) => {

    // const sensorsState = await require('../models/sensors').getSensorsState(roomId);
    // console.log(sensorsState);

    const scenarios = await require('../models/scenarios').getScenario();
    // console.log(scenarios);
    // console.log(sensorId);
  
    const touchedControllers = scenarios
      .filter(({ sensor_id }) => sensor_id == sensorId)
      .map(({
        controller_id,
        device_id,
        controller,
        controller_default,
        controller_value,
        controller_delay,
        
        controllerState,
        controllerStateUpdated,
        controllerDelayed
      }) => ({
        controllerId: controller_id,
        deviceId: device_id,
        controller,
        controllerDefault: controller_default,
        controllerValue: controller_value,
        controllerDelay: controller_delay,
        controllerState,
        controllerStateUpdated,
        controllerDelayed
      }));
    
    // console.log(touchedControllers);

    touchedControllers.forEach(({ 
      controllerId, 
      deviceId, 
      controller, 
      controllerDefault, 
      controllerValue, 
      controllerState,
      controllerStateUpdated,
      controllerDelayed
    }) => {
      const controllerList = scenarios
        .filter(({ controller_id }) => controller_id == controllerId )
      
      // console.log(controllerList);
      
      if (controllerList.every(({ checked }) => checked)) {
        console.log('Every scenario is true');
        // console.log('controllerDelayed: ', controllerDelayed)

        if (controllerState != controllerValue) {
          require('./call').fireCallToDevice({ deviceId, controller, action: controllerValue});
        } else {
          require('../models/controllers').updateControllerState({ controllerId });
        }
      } else {
        console.log('Not Every scenario is true');
        console.log('controllerDelayed: ', controllerDelayed)

        if (!controllerDelayed && controllerState != controllerDefault) {
          require('./call').fireCallToDevice({ deviceId, controller, action: controllerDefault});
        }
      }
    });
  }
};
