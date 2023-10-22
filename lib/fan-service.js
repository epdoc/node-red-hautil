"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FanService = void 0;
exports.newFanService = newFanService;
var _lightService = require("./light-service");
function newFanService(name, options) {
  return new FanService(name, options);
}
const FAN_PERCENTAGES = [0, 16, 33, 50, 66, 83, 100];
const FAN_LIMITS = [-1, 8, 25, 42, 58, 75, 92, 100];

/**
 * Payload builder for service call
 */
class FanService extends _lightService.LightService {
  _domain = 'fan';
  speed(val) {
    this._payload.service = 'set_percentage';
    this._payload.data = {
      percentage: FanService.fanSpeedToPercentage(val)
    };
    return this;
  }
  static fanSpeedToPercentage(speed) {
    let sp = speed;
    if (speed < 1 || speed >= FAN_PERCENTAGES.length) {
      sp = 2;
    }
    return FAN_PERCENTAGES[sp];
  }
  static fanPercentageToSpeed(percentage) {
    for (let pdx = 0; pdx <= 6; ++pdx) {
      if (percentage > FAN_LIMITS[pdx] && percentage <= FAN_LIMITS[pdx + 1]) {
        return pdx;
      }
    }
    return 0;
  }
}
exports.FanService = FanService;