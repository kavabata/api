
var moment = require('moment');

//zoom="minute/hour/day"
// let db = require('./db');

module.exports = {
  getPirList: ({ dateStart, dateEnd, zoom, deviceId }, callback = ()=>{} ) => {

    const getDb = require("./db").getDb;
    const db = getDb();

    let zoomGroup = `GROUP BY created`;
    let dateRange = `AND created between DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW()`;
    if (zoom === 'day') {
      zoomGroup = `GROUP BY DATE_FORMAT(created, '%Y-%m-%d')`;
      dateRange = `AND created between DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()`;
    } else if (zoom === 'hour') {
      zoomGroup = `GROUP BY DATE_FORMAT(created, '%Y-%m-%d %H:00:00')`;
      dateRange = `AND created between DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    const deviceCond = !!deviceId ? `AND device_id = ${db.escape(deviceId)}` : ``;
    
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
        state as state, 
        created
      FROM pir
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
  insertPirByKey: async ({ key, state }) => {
    var _ = require('lodash');
    const getDeviceByKey = require("./device").getDeviceByKey;
    const device = await getDeviceByKey(key);
    const deviceId = _.get(device, '0.id', 1);
    return module.exports.insertPirByDeviceId({ deviceId, state });
  },
  insertDhtByDeviceId: ({ deviceId, state }) => {
    const getDb = require("./db").getDb;
    const db = getDb();
    const created = new Date();
    const insert = `INSERT INTO pir (device_id, state, created) VALUES 
    (${db.escape(deviceId)}, ${db.escape(state)}, ${db.escape(created)})`;

    let promise = new Promise((resolve, reject) => {
      console.log(insert);
      db.query(insert, (e, { insertId }) => { resolve(insertId) });
    });

    return promise;
  },
  recalcDht: ({ device }) => {
    const align = ``;
  }
};
