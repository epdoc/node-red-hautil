// returns a promise

import { isInteger } from 'epdoc-util';
import { HA } from './ha';
import { newService } from './service';
import { delayPromise } from './util';

/**
 * Parameters:
 *  fan - (required, string) short name of the fan (e.g. 'master_bedroom')
 *  cmd - (required) One of 'on', 'off' or a number from 0 to 6.
 *  opts.timeout - (optional, ms) If set, and service is 'on', the fan will be turned off after this amount of time.
 *  opts.log - Function takes a msg and returns a promise
 */
export function setFan(gHA, fnSend, fan, cmd, opts) {
  // const switch_id = "switch." + fan + "_fan_switch";
  const DELAY = [1000, 3000];
  const fan_id = 'fan.' + fan;
  const switch_id = fan_id;
  const log = opts.log
    ? opts.log
    : (msg) => {
        return Promise.resolve();
      };
  const speed = isInteger(cmd) ? cmd : 0;

  const ha = new HA(gHA);

  // const currentPct = ha.getEntitySpeed(fan_id);
  const bLightning = ha.isEntityOn('input_boolean.lightning');
  const bEntityOn = ha.isEntityOn(switch_id);

  const bOn = cmd === 'on';
  const bOff = cmd === 'off';

  let bTurnedOn = false;

  return Promise.resolve()
    .then((resp) => {
      log(`${switch_id} is ${bEntityOn}`);
      log(`lightning is ${bLightning}`);
      if (bEntityOn && (bLightning || bOff || (!bOn && opts.speed === 0))) {
        log(`Turn off ${fan_id}`);
        let payload = newService(fan_id).service('off').payload();
        fnSend(payload);
      } else {
        log(`Leave on ${fan_id}`);
      }
      if (!bEntityOn && !bLightning && (bOn || opts.speed > 0)) {
        log('Turn on ' + switch_id);
        let payload = newService(switch_id).service('on').payload();
        fnSend(payload);
        bTurnedOn = true;
      } else {
        log(`Already on ${fan_id}`);
      }
      if (!bLightning && speed > 0 && bTurnedOn) {
        log('1st delay of ' + DELAY[0] + ' for ' + switch_id);
        return delayPromise(DELAY[0]);
      } else {
        return Promise.resolve();
      }
    })
    .then(function () {
      if (!bLightning && speed > 0) {
        log('1st set fan speed to ' + speed + ' for ' + fan_id);
        let payload = newService(fan_id).speed(speed).payload();
        fnSend(payload);
        log('2nd delay of ' + DELAY[1] + ' for ' + switch_id);
        return delayPromise(DELAY[1]);
      } else {
        log(`Skipping set speed step and first delay for ${fan_id}`);
        return Promise.resolve();
      }
    })
    .then(function () {
      if (!bLightning && speed > 0) {
        log('2nd set fan speed to ' + speed + ' for ' + fan_id);
        let payload = newService(fan_id).speed(speed).payload();
        fnSend(payload);
      }
      return Promise.resolve();
    })
    .then(function () {
      if (bOn && opts.timeout && !bLightning) {
        log(`timeout ${opts.timeout} for ${switch_id}`);
        return delayPromise(opts.timeout);
      } else {
        return Promise.resolve();
      }
    })
    .then(function () {
      if (bOn && opts.timeout && !bLightning) {
        log(`timeout turn off for ${switch_id}`);
        let payload = newService(switch_id).service('off').payload();
        fnSend(payload);
      }
      return Promise.resolve();
    });
}
