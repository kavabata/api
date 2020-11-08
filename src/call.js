
module.exports = {

  fireCallToDevice: async ({ deviceId, controller, action }) => {
    const device = await require('../models/device').getDeviceById({ deviceId });
    // const host = device.ip;
    // console.log(device);
    const host = 'http://127.0.0.1:7000/graphql';
    const query = `mutation{
      controllerCall(key: "${device.key}", controller: "${controller}", action: "${action}")
    }`;


    const http = require('http');

    const data = JSON.stringify({
      query: query
    })

    console.log('Make call to: ', host);
    console.log(query);

    const options = {
      host: '127.0.0.1',
      port: 7000,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      res.on('data', d => {
        process.stdout.write(d)
      })
    });

    req.on('error', error => {
      console.error(error)
    })
    
    req.write(data)
    req.end();

    // console.log(req);
  }
};
