
module.exports = {
  getScenario: async () => {
    const getDb = require("../db").getDb;
    const db = getDb();
    
    let query = `
      SELECT 
        s.*,
        st.value,
        ct.state as controllerState,
        ct.updated as controllerStateUpdated,
        date_add(ct.updated, interval s.controller_delay second) > NOW() as controllerDelayed,
        c.controller,
        c.name,
        c.device_id,
        c.controller_default,
        st.value BETWEEN s.sensor_start AND s.sensor_end AS checked
      FROM scenarios s
      LEFT JOIN sensors_states st ON st.sensor_id = s.sensor_id
      LEFT JOIN controllers_states ct ON ct.controller_id = s.controller_id
      LEFT JOIN controllers c ON c.id = s.controller_id
      WHERE 1
      ORDER BY sort_order
    `;

    let promise = new Promise((resolve, reject) => {
      console.log(query);
      db.query(query, (e, r) => resolve(r));
    });

    return promise;
  }
};
