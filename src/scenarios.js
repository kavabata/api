import db from './db';
import moment from 'moment';

const reduceScenario = (acc, record, index) => {
  const {
    scenario_id,
    controller_id,
    controller_value,
    controller_delay,
    controller_state,
    sensor_start,
    sensor_end,
    sensor_state,
    sensor_type
  } = record;
  const rule = {
    sensor_start,
    sensor_end,
    sensor_state,
    sensor_type
  };
  const i = acc.findIndex(({ id }) => scenario_id == id);
  if (i !== -1) {
    acc[i] = { ...acc[i], rules: [ ...acc[i].rules, rule ] };
  } else {
    acc.push({
      id: scenario_id,
      controller: {
        id: controller_id,
        value: controller_value,
        delay: controller_delay,
        state: controller_state
      },
      rules: [ rule ]
    });
  }
  return acc;
};

// check rule
const filterRule = ({ sensor_type, sensor_start, sensor_end, sensor_state }) => {
  if (sensor_type === 'temperature' || sensor_type === 'humidity' || sensor_type === 'lightlevel') {
    return parseFloat(sensor_state) >= sensor_start && parseFloat(sensor_state) <= sensor_end;
  } else if (sensor_type === 'pir') {
    const mo = moment.duration(moment(moment.now()).diff(moment(sensor_state))).asSeconds();
    const passedSeconds = mo - 18000; // difference 
    return passedSeconds >= sensor_start && passedSeconds <= sensor_end;
  }
  return true;
};

// only first scenario for each controller should stay
const reduceController = (acc, { controller }, index) => {
  if (acc.findIndex(({ id }) => id === controller.id) === -1) {
    acc.push(controller);
  }
  return acc;
};

const filterController = ({ state, value }) => value !== state;

export const getScenario = async (sensorId, modeId = 1) => 
  db({ r1: 'rules' })
    .where({ 'r1.sensor_id': sensorId })
    .join({ r: 'rules' }, 'r.scenario_id', 'r1.scenario_id')
    .join({ sc: 'scenarios' }, 'sc.id', 'r.scenario_id')
    .join({ c: 'controllers' }, 'c.id', 'sc.controller_id')
    .join({ s: 'sensors' }, 'r.sensor_id', 's.id')
    .orderBy(['c.id', 'sc.mode_id', 'sc.sort_order'])
    .select('*')
    .then((resp) => 
      resp
        .reduce(reduceScenario, [])
        .filter(({ rules }) => rules.every(filterRule))
        .reduce(reduceController, [])
        .filter(filterController)
    );


export default { getScenario };
