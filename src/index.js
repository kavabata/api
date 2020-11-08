import express from 'express';
import cors from 'cors';
import { CronJob } from 'cron';
import { graphqlHTTP } from 'express-graphql';

import config from './config';
import schema from './schema';
import resolvers from './resolvers';
import sensors from './sensors';

const app = express();
app.use(cors());
app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: resolvers,
      graphiql: true
    })
  );
app.listen(config.app.port);

const timer = new CronJob(
    '*/10 * * * * *', 
    sensors.insertTimeSensorValue, 
    null, true, 'America/Los_Angeles'
);
timer.start();
