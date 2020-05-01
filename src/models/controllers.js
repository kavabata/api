
module.exports = {
  getControllerId: async({ deviceId, controller }) => {
    const getDb = require("../db").getDb;
    const db = getDb();

    let query = `
      SELECT id FROM controllers
      WHERE device_id = ${db.escape(deviceId)}
        AND controller = ${db.escape(controller)}
      LIMIT 1
    `;
    let promise = new Promise((resolve, reject) => {
      db.query(query, (e, [{ id }]) => { 
        console.log(query);
        resolve(id);
      });
    });
    return promise;
  },
  setControllerState: async ({ key, controller, action }) => {
    const getDb = require("../db").getDb;
    const db = getDb();
    const { device_id: deviceId } = await require("./device").getDeviceByKey(key);
    const controllerId = await module.exports.getControllerId({ deviceId, controller });

    const update = `INSERT INTO controllers_states (device_id, controller_id, state) VALUES 
    (${db.escape(deviceId)}, ${db.escape(controllerId)}, ${db.escape(action)})
    ON DUPLICATE KEY UPDATE state=Values(state)
    `;

    // console.log(update);
    let promise = new Promise((resolve, reject) => {
      db.query(update, (e, { insertId }) => { 
        console.log(update);
        resolve(insertId);
      });
    });
    return promise;
  },
  updateControllerState: async({ controllerId }) => {
    const update = `
    UPDATE controllers_states 
    SET updated = NOW() 
    WHERE controller_id = ${controllerId} 
    LIMIT 1`;
    
    let promise = new Promise((resolve, reject) => {
      db.query(update, (e, { insertId }) => { 
        console.log(update);
        resolve(insertId);
      });
    });
    return promise;
  }
};
