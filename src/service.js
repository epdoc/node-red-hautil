import { isFunction, isObject } from 'epdoc-util';

export function newService(name, options) {
  return new Service(name, options);
}
export function newFan(name, options) {
  return new Service('fan.' + name, options);
}
export class Service {
  _entity_id;
  _warn;
  _payload;
  static FAN_PERCENTAGES = [0, 16, 33, 50, 66, 83, 100];
  static FAN_LIMITS = [-1, 8, 25, 42, 58, 75, 92, 100];

  constructor(entity_id, opts) {
    this._entity_id = entity_id;
    this._payload = {
      target: {
        entity_id: entity_id,
      },
    };
    const parts = entity_id.split('.');
    this._payload.domain = parts[0];
    if (isObject(opts)) {
      this._warn = isFunction(opts.warn) ? opts.warn : null;
    }
  }

  get entity_id() {
    return this._payload.target.entity_id;
  }

  domain(val) {
    this._payload.domain = val;
    return this;
  }

  service(val) {
    if (this._payload.domain === 'cover') {
      this._payload.service = val + '_cover';
    } else if (this._payload.domain === 'alarm_control_panel') {
      this._payload.service = 'alarm_' + val;
    } else if (val === 'on' || val === 'off') {
      this._payload.service = 'turn_' + val;
    } else {
      this._payload.service = val;
    }
    return this;
  }

  speed(val) {
    this._payload.service = 'set_percentage';
    this._payload.data = {
      percentage: Service.fanSpeedToPercentage(val),
    };
    return this;
  }

  percentage(val) {
    this._payload.service = 'set_percentage';
    this._payload.data = {
      percentage: val,
    };
    return this;
  }

  payload() {
    return this._payload;
  }

  static fanSpeedToPercentage(speed) {
    let sp = speed;
    if (speed < 1 || speed >= this.FAN_PERCENTAGES.length) {
      sp = 2;
    }
    return this.FAN_PERCENTAGES[sp];
  }

  static fanPercentageToSpeed(percentage) {
    for (let pdx = 0; pdx <= 6; ++pdx) {
      if (percentage > this.FAN_LIMITS[pdx] && percentage <= this.FAN_LIMITS[pdx + 1]) {
        return pdx;
      }
    }
    return 0;
  }
}
