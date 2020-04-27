const config = require('./config');
let mysql = require('mysql');
let _db;

const initDb = (callback) => {
  if (_db) {
      console.warn("Trying to init DB again!");
      return callback(null, _db);
  }

  let db = mysql.createConnection(config.db);
  
  db.connect((err) =>{
    if (err) {
        return callback(err);
    }
    
    console.log("DB initialized - connected to: PI");

    _db = db;
    return callback(null, _db);
  });
}

const getDb = () => {
  // assert.ok(_db, "init first");
  return _db;
}

module.exports = {
  getDb,
  initDb
};
