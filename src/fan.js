// returns a promise

import { HA } from "./ha";
import {  newService } from "./service";
import { delayPromise } from "./util";

/**
 * fan - (required, string) short name of the fan (e.g. 'master_bedroom')
 * service - (optional, string) If set, then 'on' or 'off'
 * speed - (optional, int) A number from 0 to 6. 0 will turn off the fan via the switch.
 * timeout - (optional, ms) If set, and service is 'on', the fan will be turned off after this amount of time.
 */
export function setFan(gHA,fan, service, speed, timeout, cb) {
  // const switch_id = "switch." + fan + "_fan_switch";
  const DELAY = [1000, 3000];
  const fan_id = 'fan.' + fan;
  const switch_id = fan_id;

  const ha = new HA (gHA);

  const currentPct = ha.getEntitySpeed(fan_id);
  const bLightning = ha.isEntityOn('input_boolean.lightning');
  const bEntityOn = ha.isEntityOn(switch_id);

  const bOn = service === 'on';
  const bOff = service === 'off';

  let bTurnedOn = false;

  debug && node.warn(switch_id + ' is ' + bEntityOn);
  debug && node.warn('lightning is ' + bLightning);

  return Promise.resolve()
    .then(function () {
      if (bEntityOn && (bLightning || bOff || (!bOn && speed === 0))) {
        debug && node.warn('Turn off ' + switch_id);
        msg.payload = newService (switch_id).service('off').payload();
        cb(msg);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bEntityOn && !bLightning && (bOn || speed > 0)) {
        debug && node.warn('Turn on ' + switch_id);
        msg.payload = newService (switch_id).service('on').payload();
        cb(msg);
        bTurnedOn = true;
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bLightning && speed > 0 && bTurnedOn) {
        debug && node.warn('1st delay of ' + DELAY[0] + ' for ' + switch_id);
        return delayPromise(DELAY[0])
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bLightning && speed > 0) {
        debug && node.warn('1st set fan speed to ' + speed + ' for ' + fan_id);
        msg.payload = newService(fan_id).speed(speed).payload();
        cb(msg);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bLightning && speed > 0) {
        debug && node.warn('2nd delay of ' + DELAY[1] + ' for ' + switch_id);
        return delayPromise(DELAY[1]);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (!bLightning && speed > 0) {
        debug && node.warn('2nd set fan speed to ' + speed + ' for ' + fan_id);
        msg.payload = newService(fan_id).speed(speed).payload();
        cb(msg);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (bOn && timeout && !bLightning) {
        debug && node.warn('timeout ' + timeout + ' for ' + switch_id);
        return delayPromise(timeout);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (bOn && timeout && !bLightning) {
        debug && node.warn('timeout turn off for ' + switch_id);
        msg.payload = newService (switch_id).service('off').payload();
        cb(msg);
      }
      return Promise.resolve();
    });
}
