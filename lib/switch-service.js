"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwitchService = void 0;
exports.newSwitchService = newSwitchService;
var _service = require("./service");
function newSwitchService(entity_id, opts) {
  return new SwitchService(entity_id, opts);
}

/**
 * Payload builder for service call
 */
class SwitchService extends _service.Service {
  _domain = 'switch';
  /**
   * Shortcut to set service to turn_on.
   * @returns
   */
  on() {
    this._payload.service = 'turn_on';
    return this;
  }

  /**
   * Shortcut to set service to turn_off.
   * @returns
   */
  off() {
    this._payload.service = 'turn_off';
    return this;
  }
}
exports.SwitchService = SwitchService;