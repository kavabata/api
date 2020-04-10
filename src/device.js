
module.exports = {
  getDevice: async ({ deviceId }) => {
    const getDb = require("./db").getDb;
    const db = getDb();
    const deviceCond = !!deviceId ? `AND id = ${db.escape(deviceId)}` : ``;
    const query = `
      SELECT * FROM devices
        WHERE 1
        ${deviceCond}
    `;

    console.log(query);
      
    let promise = new Promise((resolve, reject) => {
      db.query(query, (e, r) => resolve(r));
    });

    return promise;
  },
  getDeviceByKey: (key) => {
    const getDb = require("./db").getDb;
    const db = getDb();
    const getDevice = `SELECT * FROM devices WHERE devices.key = ${db.escape(key)} LIMIT 1`;
    console.log(getDevice);

    let promise = new Promise((resolve, reject) => {
      console.log(getDevice);
      db.query(getDevice, (e, r) => resolve(r));
    });

    return promise;
  },
  getDeviceById: ({ deviceId }) => {
    const getDb = require("./db").getDb;
    const db = getDb();
    const getDevice = `SELECT * FROM devices WHERE devices.id = ${db.escape(deviceId)} LIMIT 1`;
    
    let promise = new Promise((resolve, reject) => {
      console.log(getDevice);
      db.query(getDevice, (e, r) => resolve(r));
    });

    return promise;
  }
};
