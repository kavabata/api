import config from './config';
import knex from 'knex';

const db = knex({
  client: "mysql",
  connection: config.db
});

export default db;