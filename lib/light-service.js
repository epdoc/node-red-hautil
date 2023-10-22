"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LightService = void 0;
exports.newLightService = newLightService;
var _switchService = require("./switch-service");
function newLightService(entity_id, opts) {
  return new LightService(entity_id, opts);
}

/**
 * Payload builder for service call
 */
class LightService extends _switchService.SwitchService {
  _domain = 'light';
  percentage(val) {
    this._payload.service = 'set_percentage';
    this._payload.data = {
      percentage: val
    };
    return this;
  }
}
exports.LightService = LightService;