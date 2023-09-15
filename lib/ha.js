"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HA = void 0;
exports.newHA = newHA;
var _epdocUtil = require("epdoc-util");
var _service = require("./service");
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
  getEntity(entity_id) {
    return this._ha.states[entity_id];
  }
  isEntityOn(entity_id) {
    const entity = this.getEntity(entity_id);
    return entity && entity.state === 'on' ? true : false;
  }
  entityValueAsNumber(entity_id) {
    const entity = this.getEntity(entity_id);
    return entity && isNumber(entity.state) ? entity.state : null;
  }
  getEntitySpeed(entity_id) {
    const entity = this.getEntity(entity_id);
    // debug && node.warn(entity_id + " = " + JSON.stringify(entity));
    return entity && entity.attributes ? entity.attributes.percentage : null;
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
}
exports.HA = HA;