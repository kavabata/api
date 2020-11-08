import { config } from 'dotenv';
const env = process.env.NODE_ENV;
const { parsed: dotenv } = config();

const c = {
 app: {
   port: 7000
 },
 db: {
   host: dotenv.MYSQL_HOSTNAME,
   port: dotenv.MYSQL_PORT,
   user: dotenv.MYSQL_USERNAME,
   password: dotenv.MYSQL_PASSWORD,
   database: dotenv.MYSQL_DATABASE
 }
};

export default c;
