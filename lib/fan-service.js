"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FanService = void 0;
exports.newFanService = newFanService;
var _lightService = require("./light-service");
function newFanService(entity_id, opts) {
  return new FanService(entity_id, opts);
}

/**
 * Payload builder for service call
 */
class FanService extends _lightService.LightService {
  // _domain = 'fan';

  _domain() {
    return 'fan';
  }
}
exports.FanService = FanService;