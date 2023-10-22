"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlarmService = void 0;
exports.newAlarmService = newAlarmService;
const REG = {
  armType: new RegExp(/^(home|away|night|vacation|custom_bypass|trigger)$/)
};
function newAlarmService(name, options) {
  return new Service(name, options);
}
class ServiceArm {
  _parent;
  constructor(parent) {
    this._parent = parent;
  }
  away() {
    this._parent._payload.service = 'arm_arm_away';
    return this._parent;
  }
  home() {
    this._parent._payload.service = 'arm_arm_home';
    return this._parent;
  }
  night() {
    this._parent._payload.service = 'arm_arm_night';
    return this._parent;
  }
  vacation() {
    this._parent._payload.service = 'arm_arm_vacation';
    return this._parent;
  }
  custom_bypass() {
    this._parent._payload.service = 'arm_arm_custom_bypass';
    return this._parent;
  }
  trigger() {
    this._parent._payload.service = 'arm_arm_trigger';
    return this._parent;
  }
}

/**
 * Payload builder for alarm_control_panel
 */
class AlarmService {
  _domain = 'alarm_control_panel';
  /**
   * Shortcut to set service to alarm_disarm.
   * @returns
   */
  disarm() {
    this._payload.service = 'arm_disarm';
    return this;
  }
  arm(type) {
    if (type) {
      if (REG.armType.test(type)) {
        this._payload.service = 'arm_arm_' + type;
      }
      return this;
    } else {
      return new ServiceArm(this);
    }
  }
}
exports.AlarmService = AlarmService;