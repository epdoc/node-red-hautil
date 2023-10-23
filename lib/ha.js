"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HA = exports.EntityState = exports.Entity = void 0;
exports.newHA = newHA;
var _epdocUtil = require("epdoc-util");
var _fanSpeed6Service = require("./fan-speed6-service");
function newHA(globalHomeAssistant, options) {
  return new HA(globalHomeAssistant, options);
}
class EntityState {
  _state;
  constructor(state) {
    this._state = state;
  }
  equals(val) {
    return this._state === val;
  }
  isOn() {
    return this.equals('on');
  }
  isOff() {
    return this.equals('off');
  }
  asNumber(defval) {
    return this._state ? parseFloat(this._state) : defval;
  }
  asInt(defval) {
    return this._state ? parseInt(this._state, 10) : defval;
  }
  asInteger(defval) {
    return this.asInt(defval);
  }
  toString() {
    return this._state;
  }
  value() {
    return this._state;
  }
}
exports.EntityState = EntityState;
class Entity {
  _entity;
  constructor(entity) {
    this._entity = entity;
  }
  state() {
    return new EntityState(this._entity ? this._entity.state : undefined);
  }
  exists() {
    return this._entity ? true : false;
  }
  isOn() {
    return this.state().isOn();
  }
  isOff() {
    return this.state().isOff();
  }
  asNumber(defval) {
    return this.state().asNumber(defval);
  }
  asInt(defval) {
    return this.state().asInt(defval);
  }
  asInteger(defval) {
    return this.asInt(defval);
  }
  speed(defval) {
    if (this._entity && this._entity.attributes && this._entity.attributes.percentage) {
      return _fanSpeed6Service.FanSpeed6Service.percentageToSpeed(parseInt(this._entity.attributes.percentage), 10);
    }
    return defval;
  }
}

/**
 * Class wraps a home assistant object, for use in Node-RED functions.
 */
exports.Entity = Entity;
class HA {
  _ha;
  _options;
  _log;

  /**
   *
   * @param {Object} globalHomeAssistant The value of global.get('homeassistant')
   * @param {Function} options.log Function that takes a string as a parameter and that outputs log messages.
   */
  constructor(globalHomeAssistant, options) {
    this._ha = globalHomeAssistant.homeAssistant;
    this._options = options || {};
    this._log = (0, _epdocUtil.isFunction)(this._options.log) ? this._options.log : null;
  }
  get ha() {
    return this._ha;
  }

  /**
   *
   * @param {string} entity_id
   * @returns The entity object for the specified `entity_id`.
   */
  entity(entity_id) {
    return new Entity(this._ha.states[entity_id]);
  }

  /**
   *
   * @param {*} entity_id
   * @returns
   */
  entityState(entity_id) {
    const entity = this.entity(entity_id);
    return entity ? entity.state : null;
  }

  /**
   * For every entry in a dictionary, uses the id field to retrieve the Entity() object.
   * @param {Obj} sensorDict Object containing an id property which is an entity_id.
   */
  retrieveSensorsData(sensorDict) {
    for (const name in sensorDict) {
      if (sensorDict.hasOwnProperty(name)) {
        let item = sensorDict[name];
        item.entity = this.entity(item.id);
        if (item.type === 'boolean') {
          if (item.entity.isOn()) {
            item.on = true;
            item.off = false;
          } else if (item.entity.isOff()) {
            item.on = false;
            item.off = true;
          }
        } else if (item.type === 'number') {
          item.val = item.entity.asNumber(item.defval);
        } else if (item.type === 'int') {
          item.val = item.entity.asInt(item.defval);
        }
      }
    }
  }
}
exports.HA = HA;