
const trigger = {
  pirTrigger: (room) => {

    const pirState = getPirState(room); // true
    const lightState = getLightLevel(room); // true
    
    const roomMode = getRoomMode(room); // sleep, party, guest?
    const roomDevices = getRoomDevices(room);

    
    if (pirState == true) {
      // someone move
      if (roomMode == 'sleep') {
        // enable backlight
        setSwitchState(roomDevices.backlight, true);
        setSwitchLevel(roomDevices.ambylight, 30);
      } else if (roomMode == 'party') {
        setSwitchState(roomDevices.backlight, true);
        setSwitchState(roomDevices.mainlight, true);
        setSwitchLevel(roomDevices.ambylight, 50);
      } else if (roomMode == 'guest') {
        setSwitchState(roomDevices.backlight, true);
        setSwitchLevel(roomDevices.ambylight, 100);
      }
    }
    
  },
  dhtTrigger: () => {

  }
};

module.exports = trigger;
