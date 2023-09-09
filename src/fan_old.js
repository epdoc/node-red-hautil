(function () {
  require('utils');

  let Fan = function () {
    const DELAY = [1000, 3000];

    function Fan(name, options) {
      this.bond_id = 'fan.bond_' + name;
      this.fan_id = 'fan.' + name;
      this.switch_id = this.fan_id;
      this.warn = isFunction(this.options.warn) ? this.options.warn : null;
    }

    Fan.prototype.speedToPercentage = function (speed) {
      const PERCENTAGES = [0, 16, 33, 50, 66, 83, 100];
      let sp = speed;
      if (speed < 1 || speed >= PERCENTAGES.length) {
        sp = 2;
      }
      return PERCENTAGES[sp];
    };

    Fan.prototype.percentageToSpeed = function (percentage) {
      const LIMITS = [-1, 8, 25, 42, 58, 75, 92, 100];
      for (let pdx = 0; pdx <= 6; ++pdx) {
        if (percentage > LIMITS[pdx] && percentage <= LIMITS[pdx + 1]) {
          return pdx;
        }
      }
      return 0;
    };

    Fan.prototype.speed = function (speed) {
      return {
        entity_id: this.bond_id,
        percentage: this.fanSpeedToPercentage(speed),
      };
    };

    Fan.prototype.toServicePayload = function (service) {
      return {
        domain: 'fan',
        service: 'turn_' + service,
        target: {
          entity_id: this.bond_id,
        },
      };
    };

    Fan.prototype.toSpeedPayload = function (speed) {
      return {
        domain: 'fan',
        service: 'set_percentage',
        target: {
          entity_id: this.bond_id,
        },
        data: {
          percentage: this.fanSpeedToPercentage(speed),
        },
      };
    };

    Fan.prototype.callServices(service, speed, timeout, cb) {
      const bOn = service === 'on';
      const bOff = service === 'off';
        }
  };
});

// returns a promise
/**
 * fan - (required, string) short name of the fan (e.g. 'master_bedroom')
 * service - (optional, string) If set, then 'on' or 'off'
 * speed - (optional, int) A number from 0 to 6. 0 will turn off the fan via the switch.
 * timeout - (optional, ms) If set, and service is 'on', the fan will be turned off after this amount of time.
 */
 function setFan(fan, service, speed, timeout, cb) {
  // const switch_id = "switch." + fan + "_fan_switch";
  const DELAY = [1000, 3000];
  const fan_id = 'fan.' + fan;
  const switch_id = fan_id;
  const bOn = service === 'on';
  const bOff = service === 'off';
  const bLightning = global_functions.isEntityOn('input_boolean.lightning');
  const bEntityOn = global_functions.isEntityOn(switch_id);
  const currentSpeed = entitySpeed(fan_id);
  let bTurnedOn = false;
  debug && node.warn(switch_id + ' is ' + bEntityOn);
  debug && node.warn('lightning is ' + bLightning);

  function entitySpeed(entity_id) {
    const entity = ha.states[entity_id];
    // debug && node.warn(entity_id + " = " + JSON.stringify(entity));
    return entity && entity.attributes ? entity.attributes.percentage : null;
  }

  return Promise.resolve()
    .then(function () {
      if (bEntityOn && (bLightning || bOff || (!bOn && speed === 0))) {
        debug && node.warn('Turn off ' + switch_id);
        msg.payload = global_functions.fanServicePayload(switch_id, 'off');
        cb(msg);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bEntityOn && !bLightning && (bOn || speed > 0)) {
        debug && node.warn('Turn on ' + switch_id);
        msg.payload = global_functions.fanServicePayload(switch_id, 'on');
        cb(msg);
        bTurnedOn = true;
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bLightning && speed > 0 && bTurnedOn) {
        debug && node.warn('1st delay of ' + DELAY[0] + ' for ' + switch_id);
        return global_functions.delayPromise(DELAY[0]);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bLightning && speed > 0) {
        debug && node.warn('1st set fan speed to ' + speed + ' for ' + fan_id);
        msg.payload = global_functions.fanSpeedPayload(fan_id, speed);
        cb(msg);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bLightning && speed > 0) {
        debug && node.warn('2nd delay of ' + DELAY[1] + ' for ' + switch_id);
        return global_functions.delayPromise(DELAY[1]);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bLightning && speed > 0) {
        debug && node.warn('2nd set fan speed to ' + speed + ' for ' + fan_id);
        msg.payload = global_functions.fanSpeedPayload(fan_id, speed);
        cb(msg);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (bOn && timeout && !bLightning) {
        debug && node.warn('timeout ' + timeout + ' for ' + switch_id);
        return global_functions.delayPromise(timeout);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (bOn && timeout && !bLightning) {
        debug && node.warn('timeout turn off for ' + switch_id);
        msg.payload = global_functions.fanServicePayload(switch_id, 'off');
        cb(msg);
      }
      return Promise.resolve();
    });
}
