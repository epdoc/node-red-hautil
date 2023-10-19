import { isDict, isFunction, isNonEmptyString } from 'epdoc-util';

const REG = {
  cover: {
    postfix: {
      cover: new RegExp(/^(open|close|stop)$/),
    },
  },
  alarm_control_panel: {
    prefix: {
      arm: new RegExp(/^(arm_away|arm_home|arm_night|arm_vacation|disarm|trigger|arm_custom_bypass)$/),
    },
  },
  fan: {
    prefix: {
      turn: new RegExp(/^(on|off)$/),
      set: new RegExp(/^(direction|percentage|preset_mode)$/),
    },
  },
  light: {
    prefix: {
      turn: new RegExp(/^(on|off)$/),
    },
  },
  switch: {
    prefix: {
      turn: new RegExp(/^(on|off)$/),
    },
  },
  input_boolean: {
    prefix: {
      turn: new RegExp(/^(on|off)$/),
    },
  },
};

export function newService(name, options) {
  return new Service(name, options);
}
export function newFan(name, options) {
  return new Service('fan.' + name, options);
}

/**
 * Payload builder for service call
 */
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
    if (isDict(opts)) {
      this._warn = isFunction(opts.warn) ? opts.warn : null;
      this._warn = isFunction(opts.log) ? opts.log : null;
    }
  }

  get entity_id() {
    return this._payload.target.entity_id;
  }

  /**
   * Call if you wish to override the domain that is automatically determined
   * from the entity_id.
   * @param {*} val
   * @returns
   */
  domain(val) {
    this._payload.domain = val;
    return this;
  }

  /**
   * Shortcut to set service to turn_on.
   * @returns
   */
  on() {
    return this.service('on');
  }

  /**
   * Shortcut to set service to turn_off.
   * @returns
   */
  off() {
    return this.service('off');
  }

  /**
   * Shortcut to set service to close_cover.
   * @returns
   */
  close() {
    return this.service('close');
  }

  /**
   * Shortcut to set service to open_cover.
   * @returns
   */
  open() {
    return this.service('open');
  }
  stop() {
    return this.service('stop');
  }

  /**
   * Shortcut to set service to alarm_disarm.
   * @returns
   */
  disarm() {
    return this.service('disarm');
  }
  increment() {
    return this.service('increment');
  }
  decrement() {
    return this.service('decrement');
  }

  /**
   * Set the service. Takes the following shortcuts:
   *  - for most services on and off result in turn_on and turn_off
   *  - for cover, takes open, close, stop
   * @param {} val
   * @returns
   */
  service(val) {
    if (isNonEmptyString(val)) {
      Object.keys(REG).forEach((domain) => {
        if (this._payload.domain === domain) {
          if (REG[domain].prefix) {
            Object.keys(REG[domain].prefix).forEach((prefix) => {
              if (REG[domain].prefix[prefix].test(val)) {
                this._payload.service = prefix + '_' + val;
              }
            });
          }
          if (REG[domain].postfix) {
            Object.keys(REG[domain].postfix).forEach((postfix) => {
              if (REG[domain].postfix[postfix].test(val)) {
                this._payload.service = val + '_' + postfix;
              }
            });
          }
        }
      });
      if (!this._payload.service) {
        this._payload.service = val;
      }
    }
    return this;
  }

  value(val) {
    this._payload.service = 'set_value';
    this._payload.data = {
      value: val,
    };
    return this;
  }

  date(val) {
    this._payload.service = 'set_datetime';
    this._payload.data = {
      timestamp: Math.round(val.getTime() / 1000),
    };
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
