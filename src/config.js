// config.js
const env = process.env.NODE_ENV; // 'dev' or 'test'

const config = {
 app: {
   port: 7000
 },
 db: {
   host: process.env.MYSQL_HOST,
   port: process.env.MYSQL_PORT,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
   database: process.env.sensors
 }
};

module.exports = config;