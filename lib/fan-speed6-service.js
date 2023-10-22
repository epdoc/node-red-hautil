"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FanSpeed6Service = void 0;
exports.newFanSpeed6Service = newFanSpeed6Service;
var _lightService = require("./light-service");
function newFanSpeed6Service(entity_id, opts) {
  return new FanSpeed6Service(entity_id, opts);
}
const FAN_PERCENTAGES = [0, 16, 33, 50, 66, 83, 100];
const FAN_LIMITS = [-1, 8, 25, 42, 58, 75, 92, 100];

/**
 * Payload builder for service call
 */
class FanSpeed6Service extends _lightService.LightService {
  _domain = 'fan';
  speed(val) {
    return this.percentage(FanSpeed6Service.speedToPercentage(val));
  }
  static speedToPercentage(speed) {
    let sp = speed;
    if (speed < 1 || speed >= FAN_PERCENTAGES.length) {
      sp = 2;
    }
    return FAN_PERCENTAGES[sp];
  }
  static percentageToSpeed(percentage) {
    for (let pdx = 0; pdx <= 6; ++pdx) {
      if (percentage > FAN_LIMITS[pdx] && percentage <= FAN_LIMITS[pdx + 1]) {
        return pdx;
      }
    }
    return 0;
  }
}
exports.FanSpeed6Service = FanSpeed6Service;