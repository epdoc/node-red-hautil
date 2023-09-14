"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFan = setFan;
var _epdocUtil = require("epdoc-util");
var _ha = require("./ha");
var _service = require("./service");
var _util = require("./util");
// returns a promise

/**
 * Parameters:
 *  fan - (required, string) short name of the fan (e.g. 'master_bedroom')
 *  cmd - (required) One of 'on', 'off' or a number from 0 to 6.
 *  opts.timeout - (optional, ms) If set, and service is 'on', the fan will be turned off after this amount of time.
 *  opts.log - Function takes a msg and returns a promise
 */
function setFan(gHA, cb, fan, cmd, opts) {
  // const switch_id = "switch." + fan + "_fan_switch";
  const DELAY = [1000, 3000];
  const fan_id = 'fan.' + fan;
  const switch_id = fan_id;
  const log = opts.log ? opts.log : msg => {
    return Promise.resolve();
  };
  const speed = (0, _epdocUtil.isInteger)(cmd) ? cmd : 0;
  const ha = new _ha.HA(gHA);

  // const currentPct = ha.getEntitySpeed(fan_id);
  const bLightning = ha.isEntityOn('input_boolean.lightning');
  const bEntityOn = ha.isEntityOn(switch_id);
  const bOn = cmd === 'on';
  const bOff = cmd === 'off';
  let bTurnedOn = false;
  return Promise.resolve().then(resp => {
    return log(`${switch_id} is ${bEntityOn}`).then(resp => {
      return log(`lightning is ${bLightning}`);
    });
  }).then(function () {
    if (bEntityOn && (bLightning || bOff || !bOn && opts.speed === 0)) {
      return log(`Turn off ${fan_id}`).then(resp => {
        let payload = (0, _service.newService)(fan_id).service('off').payload();
        return cb(payload);
      });
    } else {
      return log(`Leave on ${fan_id}`);
    }
  }).then(function () {
    if (!bEntityOn && !bLightning && (bOn || opts.speed > 0)) {
      return log('Turn on ' + switch_id).then(resp => {
        let payload = (0, _service.newService)(switch_id).service('on').payload();
        return cb(payload);
      }).then(resp => {
        bTurnedOn = true;
      });
    } else {
      return log(`Already on ${fan_id}`);
    }
  }).then(function () {
    if (!bLightning && speed > 0 && bTurnedOn) {
      return log('1st delay of ' + DELAY[0] + ' for ' + switch_id).then(resp => {
        return (0, _util.delayPromise)(DELAY[0]);
      });
    }
    return Promise.resolve();
  }).then(function () {
    if (!bLightning && speed > 0) {
      return log('1st set fan speed to ' + speed + ' for ' + fan_id).then(resp => {
        let payload = (0, _service.newService)(fan_id).speed(speed).payload();
        return cb(payload);
      });
    } else {
      return log(`Skipping set speed step for ${fan_id}`);
    }
  }).then(function () {
    if (!bLightning && speed > 0) {
      return log('2nd delay of ' + DELAY[1] + ' for ' + switch_id).then(resp => {
        return (0, _util.delayPromise)(DELAY[1]);
      });
    } else {
      return log(`Skipping first delay for ${fan_id}`);
    }
  }).then(function () {
    if (!bLightning && speed > 0) {
      log && log('2nd set fan speed to ' + speed + ' for ' + fan_id);
      let payload = (0, _service.newService)(fan_id).speed(speed).payload();
      return cb(payload);
    }
    return Promise.resolve();
  }).then(function () {
    if (bOn && opts.timeout && !bLightning) {
      log && log(`timeout ${opts.timeout} for ${switch_id}`);
      return (0, _util.delayPromise)(opts.timeout);
    }
    return Promise.resolve();
  }).then(function () {
    if (bOn && opts.timeout && !bLightning) {
      log && log('timeout turn off for ' + switch_id);
      let payload = (0, _service.newService)(switch_id).service('off').payload();
      return cb(payload);
    }
    return Promise.resolve();
  });
}