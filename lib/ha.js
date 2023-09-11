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