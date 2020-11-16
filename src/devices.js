import db from "./db"

export const saveDeviceConfig = ({ key, name, value }) => {
  return db('devices')
    .where('key', key)
    .first()
    .then(({ id }) => {
      return db('devices')
        .where('id', id)
        .update(name, value)
        .update('updated', db.fn.now())
        .then((resp) => resp);
    });
}