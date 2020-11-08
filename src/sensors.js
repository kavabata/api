
import moment from 'moment';
import db from './db';
import knex from 'knex';
import resolvers from './resolvers';
import { sensorTrigger } from './trigger';

export const getSensorList = ({ dateStart, dateEnd, zoom, sensorId }, callback = ()=>{} ) => {
  let zoomGroup = `GROUP BY created`;
  let dateRange = `AND created between DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW()`;
  if (zoom === 'day') {
    zoomGroup = `GROUP BY DATE_FORMAT(created, '%Y-%m-%d')`;
    dateRange = `AND created between DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()`;
  } else if (zoom === 'hour') {
    zoomGroup = `GROUP BY DATE_FORMAT(created, '%Y-%m-%d %H:00:00')`;
    dateRange = `AND created between DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  }

  const deviceCond = !!sensorId ? `AND device_id = ${db.escape(sensorId)}` : ``;
  
  if (dateStart || dateEnd) {
    let dateStartFormat = moment(dateStart);
    let dateEndFormat = moment(dateEnd);
    if (dateStart && !dateEnd) {
      dateEndFormat = moment(dateStart).add(7, 'days');
    } else if (!dateStart && dateEnd) {
      dateStartFormat = moment(dateEnd).subtract(7, 'days');
    }
    dateRange = `created between '${dateStartFormat}' AND '${dateEndFormat}'`;
  }

  let query = `
    SELECT 
      device_id as deviceId,
      sensor_id as sensorId,
      value as value, 
      created
    FROM sensors_logs
    WHERE 1
      ${dateRange}
      ${deviceCond}
    ${zoomGroup}
    ORDER BY created ASC
    ;
    `;
    
  console.log(query);
  
  let promise = new Promise((resolve, reject) => {
    db.query(query, (e, r) => resolve(r));
  });

  return promise;
};

export const getSensorsByDeviceId = async(deviceId) => {
  const getDb = require("./db").getDb;
  const db = getDb();

  const query = `
    SELECT * FROM sensors
    WHERE device_id = ${db.escape(deviceId)}
  `;
  
  let promise = new Promise((resolve, reject) => {
    db.query(query, (e, r) => resolve(r));
  });

  return promise;
};

export const getSensorsState = async ({ roomId }) => {
  const getDb = require("./db").getDb;
  const db = getDb();

  const roomCond = !!roomId ? `AND room_id = ${db.escape(roomId)}` : ``;

  let query = `
  SELECT 
    *
  FROM sensors_states
  WHERE 1
    ${roomCond}
  ;
  `;
  let promise = new Promise((resolve, reject) => {
    db.query(query, (e, r) => resolve(r));
  });

  return promise;
};

export const getSensorIsByDeviceIdAndType = async ({ deviceId, sensorType }) => {
  const getDb = require("./db").getDb;
  const db = getDb();

  let query = `
    SELECT id, room_id FROM sensors
    WHERE
      device_id = ${db.escape(deviceId)} AND
      type = ${db.escape(sensorType)}
    LIMIT 1
  `;

  // console.log(query)
  let promise = new Promise((resolve, reject) => {
    db.query(query, (e, [{ id }]) => resolve(id));
  });

  return promise;
};

export const insertSensorValueByKey = async ({ key, sensorType, value }) => 
  db({ d: 'devices'})
    .join({ s: 'sensors' }, 's.device_id', 'd.id')
    .select('s.*')
    .where({ 'd.key': key })
    .where({ 's.sensor_type': sensorType })
    .first()
    .then((sensor) => {


      // pir exception, if TRUE, set timestamp, else no update
      let sensor_state = value;
      if (sensor.sensor_type === 'pir') {
        if (parseInt(value, 10)) {
          sensor_state = moment().unix();
        } else {
          sensor_state = sensor.sensor_state;
        }
      }

      db('sensors_logs')
      .insert({
        device_id: sensor.device_id,
        room_id: sensor.room_id,
        sensor_id: sensor.id,
        created: db.fn.now(),
        value
      })
      .then((resp) => resp);

      db('sensors')
        .where({ id: sensor.id })
        .update('sensor_state', sensor_state)
        .update('sensor_updated', db.fn.now())
        .then((resp) => {
          console.log('pre sensorTrigger ')
          sensorTrigger(sensor);
        });

      console.log('Close request')
      return 'true';
    });

export const insertTimeSensorValue = async () => 
  db('sensors')
    .where({ 'sensor_type': 'time' })
    .update('sensor_updated', db.fn.now())
    .update('sensor_state', moment().diff(moment().startOf('day'), 'seconds'))
    .then((resp) => resp);


export default {
  getSensorList,
  getSensorsByDeviceId,
  getSensorsState,
  getSensorIsByDeviceIdAndType,
  insertSensorValueByKey,
  insertTimeSensorValue
};