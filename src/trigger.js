import db from './db';
import http from 'http';
import { getScenario } from './scenarios';

// const getMode = async (room_id) => 
//   db('rooms')
//     .where({ id: room_id })
//     .select('mode_id')
//     .first()
//     .then(({ mode_id }) => mode_id);

export const sensorTrigger = async ({ id, sensor_type }) => {
  
  console.log('sensorTrigger:', id, sensor_type);
  const scenarios = await getScenario(id);    
  console.log('scenariosAffected', scenarios);
 
  scenarios.map(({ id, value, delay }) => {
    db({ c: 'controllers' })
      .join({ d: 'devices' }, 'd.id', 'c.device_id')
      .where({ 'c.id': id })
      .first()
      .then(({ ip, controller }) => {

        const controllerOptions = {
          host: ip,
          method: 'GET',
          path: `/set:${controller}/value:${value}/delay:${delay}`
        }

        console.log('setControllerState', controllerOptions);

        const req = http
          .request(controllerOptions, (res) => {
            console.log('controllerResponce', res);

            res.on('data', (r) => console.log('requestData', r));
            res.on('end', (r) => console.log('requestEnd', r));
            
            db('controllers')
              .where({ id })
              .update('controller_state', value)
              .update('updated', db.fn.now())
              .then((resp) => resp)
          });
          
          req.on('error', (r) => console.log('requestError', r))

      });
  })
};

export default { sensorTrigger };