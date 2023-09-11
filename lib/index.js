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
  toServicePayload(service) {
    return {
      domain: 'fan',
      service: 'turn_' + service,
      target: {
        entity_id: this.bond_id
      }
    };
  }
  toSpeedPayload(speed) {
    return {
      domain: 'fan',
      service: 'set_percentage',
      target: {
        entity_id: this.bond_id
      },
      data: {
        percentage: Fan.speedToPercentage(speed)
      }
    };
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HA = void 0;
exports.newHA = newHA;
var _epdocUtil = require("epdoc-util");
var _fan = require("./fan");
function newHA(globalHomeAssistant, options) {
  return new HA(globalHomeAssistant, options);
}
class HA {
  _ha;
  _options;
  _log;
  constructor(globalHomeAssistant, options) {
    this._ha = globalHomeAssistant.homeAssistant;
    this._options = options || {};
    this._log = (0, _epdocUtil.isFunction)(this._options.log) ? this._options.log : null;
  }
  get ha() {
    return this._ha;
  }
  isEntityOn(entity_id) {
    const entity = this._ha.states[entity_id];
    return entity && entity.state === 'on' ? true : false;
  }

  /**
   *
   * @param {Obj} sensorDict Object containing an id property which is an entity_id.
   */
  retrieveSensorsData(sensorDict) {
    for (const name in sensorDict) {
      if (sensorDict.hasOwnProperty(name)) {
        let item = sensorDict[name];
        item.obj = this.ha.states[item.id];
        if (item.obj) {
          item.state = item.obj.state;
        }
      }
    }
  }

  /**
   * d.service = on, off, toggle, speed, percentage, arm_night, arm_away, arm_home, disarm
   */
  static getServicePayload(params) {
    let p = {
      service: params.service,
      target: {
        entity_id: params.entity_id
      }
    };
    if (params.domain) {
      p.domain = params.domain;
    } else {
      const parts = params.entity_id.split('.');
      p.domain = parts[0];
    }
    if (params.service === 'on' || params.service === 'off') {
      p.service = 'turn_' + params.service;
    }
    if (p.domain === 'fan') {
      if (params.service === 'speed') {
        p.service = 'set_percentage';
        p.data = {
          percentage: _fan.Fan.speedToPercentage(params.speed)
        };
      } else if (p.service === 'percentage') {
        p.data = {
          percentage: params.percentage
        };
      }
    } else if (p.domain === 'cover') {
      p.service = params.service + '_cover';
    } else if (p.domain === 'alarm_control_panel') {
      p.service = 'alarm_' + params.service;
    }
    return p;
  }
}
exports.HA = HA;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocationHistory = void 0;
exports.newLocationHistory = newLocationHistory;
function newLocationHistory(options) {
  return new LocationHistory(options);
}
class LocationHistory {
  history = {};
  warn = null;
  dirty = false;
  constructor(options) {
    this.GATE_HISTORY = 'gate_history';
    this.history = {};
    this.options = options || {};
    this.warn = isFunction(this.options.warn) ? this.options.warn : null;
    this.dirty = isBoolean(this.options.dirty) ? this.options.dirty : false;
    this.read();
  }
  read() {
    this.history = this.options.getStorage(this.GATE_HISTORY) || {};
    return this;
  }
  add(person, location, time) {
    let items = this.history[person];
    if (!Array.isArray(items)) {
      items = [];
    }
    items.push({
      location: location,
      time: time
    });
    this.history[person] = items;
    this.dirty = true;
    return this;
  }

  /**
   * Find the person at any one of the locations, after the time defined by tCutoff
   * @param {} person
   * @param {*} tCutoff date (ms)
   * @param {*} locations Individual or array of location names
   * @returns
   */
  find(person, tCutoff, locations) {
    locations = isArray(locations) ? locations : [locations];
    const items = this.history[person];
    let result = false;
    if (isArray(items)) {
      for (let idx = 0; idx < items.length && !result; ++idx) {
        const item = items[idx];
        this.warn && this.warn(`Entry: (${item.location}, ${new Date(item.time).toLocaleTimeString()})`);
        for (let ldx = 0; ldx < locations.length && !result; ++ldx) {
          const location = locations[ldx];
          this.warn && this.warn(`Testing (${item.location}, ${new Date(item.time).toLocaleTimeString()}) against location ${location} cutoff ${new Date(tCutoff).toLocaleTimeString()}.`);
          if (item.location === location && tCutoff < item.time) {
            result = true;
          }
        }
      }
    }
    return result;
  }
  prune(tCutoff) {
    Object.keys(this.history).forEach(key => {
      const items = this.history[key];
      let newItems = [];
      if (isArray(items)) {
        for (let idx = 0; idx < items.length; ++idx) {
          const item = items[idx];
          if (tCutoff < item.time) {
            newItems.push(item);
          }
        }
      }
      if (!isArray(items) || newItems.length !== items.length) {
        this.history[key] = newItems;
        this.dirty = true;
      }
    });
    return this;
  }
  flush() {
    if (this.dirty) {
      this.setStorage(this.GATE_HISTORY, this.history);
      this.dirty = false;
    }
    return this;
  }
  toString() {
    let result = {};
    Object.keys(this.history).forEach(key => {
      const items = this.history[key];
      result[key] = [];
      if (isArray(items)) {
        for (let idx = 0; idx < items.length; ++idx) {
          const item = items[idx];
          const newItem = {
            location: item.location,
            time: new Date(item.time).toLocaleTimeString()
          };
          result[key].push(newItem);
        }
      }
    });
    return JSON.stringify(result);
  }
}
exports.LocationHistory = LocationHistory;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocationMoving = void 0;
exports.newLocationMoving = newLocationMoving;
function newLocationMoving(person, history, oldLocation, newLocation) {
  return new LocationMoving(person, history, oldLocation, newLocation);
}
class LocationMoving {
  person;
  history;
  oldLocation;
  newLocation;
  constructor(person, history, oldLocation, newLocation) {
    this.person = person;
    this.history = history;
    this.oldLocation = oldLocation;
    this.newLocation = newLocation;
  }
  moving(locations, tCutoffMs) {
    let result = false;
    for (let ldx = locations.length - 1; ldx >= 0 && !result; --ldx) {
      if (this.newLocation === locations[ldx]) {
        const before = locations.slice(0, ldx);
        if (before.find(this.oldLocation)) {
          result = true;
        } else {
          for (let bdx = 0; bdx < before.length - 1 && !result; ++bdx) {
            if (this.history.find(this.person, tCutoffMs, before[bdx])) {
              result = true;
            }
          }
        }
      }
    }
    return result;
  }
}
exports.LocationMoving = LocationMoving;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delayPromise = delayPromise;
exports.googleDate = googleDate;
exports.msToObj = msToObj;
exports.msToString = msToString;
/**
 * Convert a javascript Date object to a date value used by Google Sheets.
 * @param {*} jsDate 
 * @returns 
 */
function googleDate(jsDate) {
  const d = new Date(jsDate);
  const tNull = new Date(Date.UTC(1899, 11, 30, 0, 0, 0, 0)); // the starting value for Google
  return ((d.getTime() - tNull.getTime()) / 60000 - d.getTimezoneOffset()) / 1440;
}
function delayPromise(ms) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}

/**
 * Convert a millsecond time (duration) value to an object and string.
 * @param {} milliseconds 
 * @returns 
 */
function msToObj(milliseconds) {
  let result = {
    timestring: '',
    // for text message use
    notistring: '',
    // for audible message use
    s: parseInt(milliseconds / 1000, 10) % 60,
    m: parseInt(milliseconds / 60000, 10) % 60,
    h: parseInt(milliseconds / 3600000, 10) % 60,
    d: parseInt(milliseconds / 86400000, 10) % 24
  };
  if (result.d > 0) {
    result.timestring = result.d + 'D ';
    result.notistring = result.d + ' days ';
  }
  if (result.d > 0 && result.h < 10) {
    result.timestring = result.timestring + '0';
  }
  if (result.h > 0) {
    result.timestring = result.timestring + result.h + ':';
  }
  if (result.h > 0 || result.notistring !== '') {
    result.notistring = result.h + ' hours ';
  }
  if (result.m < 10 && result.timestring.length) {
    result.timestring = result.timestring + '0';
  }
  result.timestring = result.timestring + result.m + ':';
  if (result.m || result.notistring !== '') {
    result.notistring += result.m + ' minutes ';
  }
  if (result.s < 10) {
    result.timestring = result.timestring + '0';
  }
  result.notistring += result.s + ' seconds';
  result.timestring = result.timestring + result.s;
  return result;
}
function msToString(milliseconds) {
  return msToObj(milliseconds).timestring;
}
