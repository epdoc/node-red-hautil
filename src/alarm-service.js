import { Service } from './service';

const REG = {
  armType: new RegExp(/^(home|away|night|vacation|custom_bypass|trigger)$/),
};

export function newAlarmService(name, options) {
  return new Service(name, options);
}
class ServiceArm {
  _parent;
  constructor(parent) {
    this._parent = parent;
  }
  away() {
    this._parent._payload.service = 'alarm_arm_away';
    return this._parent;
  }
  home() {
    this._parent._payload.service = 'alarm_arm_home';
    return this._parent;
  }
  night() {
    this._parent._payload.service = 'alarm_arm_night';
    return this._parent;
  }
  vacation() {
    this._parent._payload.service = 'alarm_arm_vacation';
    return this._parent;
  }
  custom_bypass() {
    this._parent._payload.service = 'arm_arm_custom_bypass';
    return this._parent;
  }
  trigger() {
    this._parent._payload.service = 'alarm_trigger';
    return this._parent;
  }
}

/**
 * Payload builder for alarm_control_panel
 */
export class AlarmService extends Service {
  // _domain = 'alarm_control_panel';
  _domain() {
    return 'alarm_control_panel';
  }

  /**
   * Shortcut to set service to alarm_disarm.
   * @returns
   */
  disarm() {
    this._payload.service = 'alarm_disarm';
    return this;
  }

  arm(type) {
    if (type) {
      if (REG.armType.test(type)) {
        this._payload.service = 'alarm_arm_' + type;
      }
      return this;
    } else {
      return new ServiceArm(this);
    }
  }
}
