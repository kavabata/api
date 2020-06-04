// src/index.js
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require('./schema');
const resolvers = require("./resolvers");
const config = require("./config");

const initDb = require("./db").initDb;
initDb(() => {});
const db = require("./db").getDb();

// var CronJob = require('cron').CronJob;
// var _timeSensor = new CronJob('*/10 * * * * *', () => require('./models/sensors').insertTimeSensorValue(), null, true, 'America/Los_Angeles');
// timeSensor.start();

const app = express();
const cors = require('cors');
app.use(cors())

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);
app.listen(config.app.port);


console.log(`🚀 Server ready at http://localhost:${config.app.port}/graphql`);