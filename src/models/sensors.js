// import { sensorTrigger } from '../controllers/trigger';
var moment = require('moment');

module.exports = {
  getSensorList: ({ dateStart, dateEnd, zoom, sensorId }, callback = ()=>{} ) => {


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
      FROM sensors_states
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
      
  },
  getSensorsState: async ({ roomId }) => {
    const getDb = require("../db").getDb;
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
  },
  getSensorIsByDeviceIdAndType: async ({ deviceId, sensorType }) => {
    const getDb = require("../db").getDb;
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
  },
  // getSensorId: async({ deviceId, sensorType }) => {
  //   var _ = require('lodash');
  //   const sensors = await module.exports.getSensorsByDeviceId({ deviceId, sensorType });
  //   console.log(deviceId, sensorType, '--------')
  //   return _.get(sensors.filter(({ type }) => type == sensorType), 'id', '0');
  // },
  insertSensorValueByKey: async ({ key, sensorType, value }) => {
    var _ = require('lodash');
    const getDeviceByKey = require("./device").getDeviceByKey;
    const device = await getDeviceByKey(key);
    const deviceId = _.get(device, 'device_id', 0);
    const roomId = _.get(device, 'room_id', 0);

    // console.log(device);
    const sensorId = await module.exports.getSensorIsByDeviceIdAndType({ deviceId, sensorType });
    // console.log(sensorId);
    resultId = await module.exports.insertSensorValue({ deviceId, sensorId, roomId, value });
    
    
    require('../controllers/trigger').sensorTrigger({ deviceId, sensorId, roomId, value });

    return resultId;
  },
  insertSensorValue: ({ deviceId, sensorId, roomId, value  }) => {
    const getDb = require("../db").getDb;
    const db = getDb();

    const created = new Date();

    const update = `INSERT INTO sensors_states (device_id, sensor_id, room_id, value, updated) VALUES 
    (${db.escape(deviceId)}, ${db.escape(sensorId)}, ${db.escape(roomId)}, ${db.escape(value)}, ${db.escape(created)})
    ON DUPLICATE KEY UPDATE value=Values(value)
    `;

    const insert = `INSERT INTO sensors_logs (device_id, sensor_id, room_id, value, created) VALUES 
    (${db.escape(deviceId)}, ${db.escape(sensorId)}, ${db.escape(roomId)}, ${db.escape(value)}, ${db.escape(created)})
    `;
    let promise = new Promise((resolve, reject) => {

      db.query(update, (e) => { 
        console.log(update);

        db.query(insert, (e, { insertId }) => {
          console.log(insert);
          resolve(insertId);
        })
      })
    });

    return promise;
  }
};
