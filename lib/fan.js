"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fan = void 0;
exports.newFan = newFan;
exports.setFan = setFan;
var _epdocUtil = require("epdoc-util");
function newFan(name, options) {
  return new Fan(name, options);
}
class Fan {
  static DELAY = [1000, 3000];
  static PERCENTAGES = [0, 16, 33, 50, 66, 83, 100];
  static LIMITS = [-1, 8, 25, 42, 58, 75, 92, 100];
  bond_id;
  fan_id;
  switch_id;
  warn = null;
  constructor(name, options) {
    this.bond_id = 'fan.bond_' + name;
    this.fan_id = 'fan.' + name;
    this.switch_id = this.fan_id;
    this.options = (0, _epdocUtil.isObject)(options) ? options : {};
    this.warn = (0, _epdocUtil.isFunction)(this.options.warn) ? this.options.warn : null;
  }
  static speedToPercentage(speed) {
    let sp = speed;
    if (speed < 1 || speed >= this.PERCENTAGES.length) {
      sp = 2;
    }
    return this.PERCENTAGES[sp];
  }
  static percentageToSpeed(percentage) {
    for (let pdx = 0; pdx <= 6; ++pdx) {
      if (percentage > this.LIMITS[pdx] && percentage <= this.LIMITS[pdx + 1]) {
        return pdx;
      }
    }
    return 0;
  }
  speed(speed) {
    return {
      entity_id: this.bond_id,
      percentage: Fan.speedToPercentage(speed)
    };
  }

  /**
   * 
   * @param {*} service One of 'on', 'off', 'speed', or 'percentage'
   * @param {*} val If speed then this must be in range 0 to 6. If percentage then this must be in range 0 to 100.
   * @returns payload to send to HASSIO service call
   */
  toServicePayload(service, val) {
    let result = {
      domain: 'fan',
      service: 'turn_' + opts.service,
      target: {
        entity_id: this.bond_id
      }
    };
    if (service === 'on' || service === 'off') {
      result.service = 'turn_' + service;
    } else if (service === 'speed' && isPosInteger(val)) {
      result.service = 'set_percentage';
      result.data = {
        percentage: Fan.speedToPercentage(val)
      };
    } else if (service === 'percentage' && isNumber(val)) {
      result.service = 'set_percentage';
      result.data = {
        percentage: val
      };
    }
    return result;
  }
  toSpeedServicePayload(speed) {
    return this.toServicePayload('speed', speed);
  }
  callServices(service, speed, timeout, cb) {
    const bOn = service === 'on';
    const bOff = service === 'off';
  }
}

// returns a promise
/**
 * fan - (required, string) short name of the fan (e.g. 'master_bedroom')
 * service - (optional, string) If set, then 'on' or 'off'
 * speed - (optional, int) A number from 0 to 6. 0 will turn off the fan via the switch.
 * timeout - (optional, ms) If set, and service is 'on', the fan will be turned off after this amount of time.
 */
exports.Fan = Fan;
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
  return Promise.resolve().then(function () {
    if (bEntityOn && (bLightning || bOff || !bOn && speed === 0)) {
      debug && node.warn('Turn off ' + switch_id);
      msg.payload = global_functions.fanServicePayload(switch_id, 'off');
      cb(msg);
    }
    return Promise.resolve();
  }).then(function () {
    if (!bEntityOn && !bLightning && (bOn || speed > 0)) {
      debug && node.warn('Turn on ' + switch_id);
      msg.payload = global_functions.fanServicePayload(switch_id, 'on');
      cb(msg);
      bTurnedOn = true;
    }
    return Promise.resolve();
  }).then(function () {
    if (!bLightning && speed > 0 && bTurnedOn) {
      debug && node.warn('1st delay of ' + DELAY[0] + ' for ' + switch_id);
      return global_functions.delayPromise(DELAY[0]);
    }
    return Promise.resolve();
  }).then(function () {
    if (!bLightning && speed > 0) {
      debug && node.warn('1st set fan speed to ' + speed + ' for ' + fan_id);
      msg.payload = global_functions.fanSpeedPayload(fan_id, speed);
      cb(msg);
    }
    return Promise.resolve();
  }).then(function () {
    if (!bLightning && speed > 0) {
      debug && node.warn('2nd delay of ' + DELAY[1] + ' for ' + switch_id);
      return global_functions.delayPromise(DELAY[1]);
    }
    return Promise.resolve();
  }).then(function () {
    if (!bLightning && speed > 0) {
      debug && node.warn('2nd set fan speed to ' + speed + ' for ' + fan_id);
      msg.payload = global_functions.fanSpeedPayload(fan_id, speed);
      cb(msg);
    }
    return Promise.resolve();
  }).then(function () {
    if (bOn && timeout && !bLightning) {
      debug && node.warn('timeout ' + timeout + ' for ' + switch_id);
      return global_functions.delayPromise(timeout);
    }
    return Promise.resolve();
  }).then(function () {
    if (bOn && timeout && !bLightning) {
      debug && node.warn('timeout turn off for ' + switch_id);
      msg.payload = global_functions.fanServicePayload(switch_id, 'off');
      cb(msg);
    }
    return Promise.resolve();
  });
}