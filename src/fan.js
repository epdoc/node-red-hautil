import {
  delayPromise,
  isDict,
  isFunction,
  isInteger,
  isNonEmptyArray,
  isNonEmptyString,
  isNumber,
  isString,
} from 'epdoc-util';
import { Service, newFanSpeed6Service, newSwitchService } from './';
import { HA } from './ha';

const REG = {
  onoff: new RegExp(/^(on|off)$/, 'i'),
};

/**
 * Custom Node-RED function code for controlling a fan where (i) the fan on/off
 * is controlled by a switch (ii) the fan speed is controlled by a Bond Bridge
 * that sends out RF signals to the fan. Supports reading the state of an input
 * boolean that will keep the fan off. This can be used, for example, when there
 * is a lightning storm and you wish to keep the fan switched off at it's
 * switch.
 * @param {Object} gHA Should be set to the return value of
 *  `global.get('homeassistant')`.
 * @param {Function} fnSend Callback to send a payload to the Call Service node.
 * @param {string} params.fan - short name of fan (eg. 'master_bedroom')
 * @param {number} params.speed Sets the speed of the fan, in the range 1 to 6.
 * Setting the fan speed to 0 will turn off fan, unless params.service is 'on'
 * @param {number} params.percentage Can be used instead of `speed`. `speed`
 * takes precedence.
 * @param {string} params.service When you just want to turn the fan on or off
 * without altering speed. Must be `on` or `off`.
 * @param {milliseconds} params.timeout Use in conjunction with service 'on' to turn
 * the fan 'off' after timeout milliseconds. A value of 0 is ignored.
 * @param {Array} opts.delay An array of two delays, in milliseconds, to use
 * when setting the fan speed. These are used to set the speed delay[0] ms after
 * a fan is first tunred on, and again delay[1] ms later. This ensures that the
 * fan is on before the RF control signal is sent. Defaults to [1000, 3000].
 * @param {Function} opts.log A gunction that takes a msg and returns a promise
 * and that can be used to log debug message.
 * @param {string} opts.shutoff_entity_id The entity_id of an entity that
 * indicates that the fan should remain off (eg. during a lightning storm)
 * @returns
 */
export function setFan(gHA, fnSend, params, opts) {
  // const switch_id = "switch." + fan + "_fan_switch";
  const fan_id = 'fan.' + params.fan;
  const switch_id = fan_id;

  opts = isDict(opts) ? opts : {};
  const log = isFunction(opts.log) ? opts.log : (msg) => {};
  const DELAY = isNonEmptyArray(opts.delay) ? opts.delay : [1000, 3000];

  const ha = new HA(gHA);
  const bShutoff = isNonEmptyString(opts.shutoff_entity_id) ? ha.entity('input_boolean.lightning').isOn() : false;

  const swutch = ha.entity(switch_id);

  function fanState() {
    return ha.entity(switch_id).state();
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
  const timeout = parseInt(params.timeout, 10);

  // const currentPct = ha.getEntitySpeed(fan_id);

  let bTurnedOn = false;

  return Promise.resolve()
    .then((resp) => {
      log(`${switch_id} is ${swutch.state()}`);
      log(`Shutoff (lightning) is ${bShutoff}`);
      if (swutch.isOn() && (bShutoff || bOff || (!bOn && speed === 0))) {
        log(`Turn off ${fan_id}`);
        let payload = newFanSpeed6Service(params.fan).off().payload();
        fnSend(payload);
      } else {
        log(`Fan ${fan_id} is ${swutch.state()}, no need to turn off`);
      }
      if (!swutch.isOn() && !bShutoff && (bOn || speed > 0)) {
        log(`Turn on ${switch_id} because fan was off`);
        let payload = newSwitchService(switch_id).on().payload();
        fnSend(payload);
        bTurnedOn = true;
      } else {
        log(`Fan ${fan_id} is already on`);
      }
      if (!bShutoff && speed > 0 && bTurnedOn) {
        log('1st delay of ' + DELAY[0] + ' for ' + switch_id);
        return delayPromise(DELAY[0]);
      } else {
        return Promise.resolve();
      }
    })
    .then(function () {
      if (!bShutoff && speed > 0) {
        log('1st set fan speed to ' + speed + ' for ' + fan_id);
        let payload = newFanSpeed6Service(params.fan).speed(speed).payload();
        fnSend(payload);
        log('2nd delay of ' + DELAY[1] + ' for ' + switch_id);
        return delayPromise(DELAY[1]);
      } else {
        log(`Skipping set speed step and first delay for ${fan_id}`);
        return Promise.resolve();
      }
    })
    .then(function () {
      if (!bShutoff && speed > 0) {
        log('2nd set fan speed to ' + speed + ' for ' + fan_id);
        let payload = newFanSpeed6Service(params.fan).speed(speed).payload();
        fnSend(payload);
      }
      return Promise.resolve();
    })
    .then(function () {
      if ((bOn || speed > 0) && timeout && !bShutoff) {
        log(`timeout ${timeout} for ${switch_id}`);
        return delayPromise(timeout);
      } else {
        return Promise.resolve();
      }
    })
    .then(function () {
      if ((bOn || speed > 0) && timeout && !bShutoff) {
        log(`timeout turn off for ${switch_id}`);
        let payload = newSwitchService(switch_id).off().payload();
        fnSend(payload);
      }
      return Promise.resolve();
    });
}
