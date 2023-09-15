// returns a promise

import { isDict, isFunction, isInteger, isNumber, isPosInteger, isString } from 'epdoc-util';
import { HA } from './ha';
import { Service, newService } from './service';
import { delayPromise } from './util';

const REG = {
  onoff: new RegExp(/^(on|off)$/, 'i'),
};

/**
 * Parameters:
 *  gHA - Set to global.get('homeassistant')
 *  fnSend - callback is passed the payload for a message to pass to the Set Service node.
 *  params.fan - short name of fan (eg. 'master_bedroom')
 *  params.speed - speed (1-6) to set fan. 0 will turn off fan, unless params.service is 'on'
 *  params.percentage - can be used instead of speed. speed takes precedence. 
 *  params.service - must be 'on' or 'off'. 
 *  params.timeout - used with service 'on' to turn fan 'off' after timeout milliseconds. 
 *  opts.log - callback is passed a string for writing debug messages
 });
 });
 *  fan - (required, string) short name of the fan (e.g. 'master_bedroom')
 *  cmd - (required) One of 'on', 'off' or a number from 0 to 6.
 *  opts.timeout - (optional, ms) If set, and service is 'on', the fan will be turned off after this amount of time.
 *  opts.log - Function takes a msg and returns a promise
 */
export function setFan(gHA, fnSend, params, opts) {
  // const switch_id = "switch." + fan + "_fan_switch";
  const DELAY = [1000, 3000];
  const fan_id = 'fan.' + params.fan;
  const switch_id = fan_id;
  opts = isDict(opts) ? opts : {};
  const log = isFunction(opts.log) ? opts.log : (msg) => {};

  const ha = new HA(gHA);
  const bLightning = ha.isEntityOn('input_boolean.lightning');
  function isFanOn() {
    return ha.isEntityOn(switch_id);
  }
  function fanState() {
    return ha.entityState(switch_id)
  }

  let speed;
  let service;
  let bOn = false;
  let bOff = false;
  if (isInteger(params.speed)) {
    speed = params.speed;
  } else if (isNumber(params.percentage)) {
    speed = Service.fanPercentageToSpeed(params.percentage);
  } else if (isString(params.service) && REG.onoff.test(params.service)) {
    service = params.service;
    bOn = service === 'on';
    bOff = service === 'off';
  }
  const timeout = parseInt(params.timeout,10);

  // const currentPct = ha.getEntitySpeed(fan_id);

  let bTurnedOn = false;

  return Promise.resolve()
    .then((resp) => {
      log(`${switch_id} is ${fanState()}`);
      log(`lightning is ${bLightning}`);
      if (isFanOn() && (bLightning || bOff || (!bOn && speed === 0))) {
        log(`Turn off ${fan_id}`);
        let payload = newService(fan_id).service('off').payload();
        fnSend(payload);
      } else {
        log(`Fan ${fan_id} is ${fanState()}, no need to turn off`);
      }
      if (!isFanOn() && !bLightning && (bOn || speed > 0)) {
        log(`Turn on ${switch_id} because fan was off`);
        let payload = newService(switch_id).service('on').payload();
        fnSend(payload);
        bTurnedOn = true;
      } else {
        log(`Fan ${fan_id} is already on`);
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
      if (bOn && timeout && !bLightning) {
        log(`timeout ${timeout} for ${switch_id}`);
        return delayPromise(timeout);
      } else {
        return Promise.resolve();
      }
    })
    .then(function () {
      if (bOn && timeout && !bLightning) {
        log(`timeout turn off for ${switch_id}`);
        let payload = newService(switch_id).service('off').payload();
        fnSend(payload);
      }
      return Promise.resolve();
    });
}
