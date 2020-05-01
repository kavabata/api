
module.exports = {
  getControllerId: async({ deviceId, type }) => {
    const getDb = require("../db").getDb;
    const db = getDb();

    let query = `
      SELECT id FROM controllers
      WHERE device_id = ${db.escape(deviceId)}
        AND type = ${db.escape(type)}
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
  setControllerState: async ({ key, controller: type, action }) => {
    const getDb = require("../db").getDb;
    const db = getDb();
    const { device_id: deviceId } = await require("./device").getDeviceByKey(key);
    const controllerId = await module.exports.getControllerId({ deviceId, type });

    const update = `INSERT INTO controllers_states (device_id, controller_id, state) VALUES 
    (${db.escape(deviceId)}, ${db.escape(controllerId)}, ${db.escape(action)})
    ON DUPLICATE KEY UPDATE state=Values(state)
    `;

    // console.log(update);
    let promise = new Promise((resolve, reject) => {
      db.query(update, (e) => { 
        console.log(update);
        // resolve(e);
        resolve(e);
      });
    });
    return promise;
  }
};
