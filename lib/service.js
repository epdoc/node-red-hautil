"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Service = void 0;
exports.newService = newService;
var _epdocUtil = require("epdoc-util");
function newService(entity_id, opts) {
  return new Service(entity_id, opts);
}

/**
 * Payload builder for Call Service node.
 */
class Service {
  _entity_id;
  _warn;
  _info;
  _payload = {};

  /**
   * Create a new Service object that is used to create a payload that can be
   * passed to a Call Service node.
   * @param {string} entity_id (required) If _domain is not set by a subclass,
   * this must contain the full entity_id of the entity to be controlled (e.g.
   * 'fan.bedroom'). Otherwise, if the subclass defines this._domain, this can
   * just contain the later part of the entity_id (eg. 'bedroom').
   * @param {function} opts.warn (optional) A logging function for logging
   * warnings. The function takes a single string parameter.
   * @param {function} opts.log (optional) A logging function for logging info
   * messages. The function takes a single string parameter.
   */
  constructor(entity_id, opts) {
    console.log(`Inputs ${entity_id} using domain ${this._domain}`);
    if (this._domain && !entity_id.includes('.')) {
      console.log(`Inputs ${entity_id} using domain ${this._domain}`);
      this._entity_id = this._domain + '.' + entity_id;
      this._payload.domain = this._domain;
    } else {
      this._entity_id = entity_id;
      if (entity_id.includes('.')) {
        const parts = entity_id.split('.');
        this._payload.domain = parts[0];
      }
      console.log(`Input ${entity_id} sets domain ${this._payload.domain} and entity_id ${this._entity_id}`);
    }
    this._payload.target = {
      entity_id: this._entity_id
    };
    console.log(`Setting entity_id to ${this._payload.target.entity_id}`);
    if ((0, _epdocUtil.isDict)(opts)) {
      this._warn = (0, _epdocUtil.isFunction)(opts.warn) ? opts.warn : null;
      this._info = (0, _epdocUtil.isFunction)(opts.info) ? opts.info : null;
    }
  }
  get entity_id() {
    return this._payload.target.entity_id;
  }

  /**
   * Call if you wish to override the domain that is automatically determined
   * from the entity_id that has been provided to the constructor.
   * @param {string} val The domain string (e.g. 'fan' or 'light')
   * @returns this
   */
  domain(val) {
    this._payload.domain = val;
    if (!this._payload.target.entity_id.includes('.')) {
      this._payload.target.entity_id = val + '.' + entity_id;
    }
    return this;
  }

  /**
   * Set the service field, for example 'turn_on'.
   * @param {string} val The string to use in a service field.
   * @returns
   */
  service(val) {
    this._payload.service = val;
    return this;
  }

  /**
   * Returns the payload dictionary that can be set in msg.payload when using
   * the Call Service node.
   * @returns The payload dictionary
   */
  payload() {
    return this._payload;
  }

  /**
   * Increment a value. Applies only to service calls that support 'increment'.
   * @returns this
   */
  increment() {
    this._payload.service = 'increment';
    return this;
  }

  /**
   * Decrement a value. Applies only to service calls that support `decrement`.
   * @returns this
   */
  decrement() {
    this._payload.service = 'decrement';
    return this;
  }

  /**
   * Use the `set_value` service and set the value. Applies only to service
   * calls that support `set_value`.
   * @param {*} val
   * @returns
   */
  value(val) {
    this._payload.service = 'set_value';
    this._payload.data = {
      value: val
    };
    return this;
  }

  /**
   * Set a date. Applies only to service calls that support `set_datetime`. Note
   * that we are using the form of `set_datetime` that uses `timestamp` and the
   * number of seconds since the epoch.
   * @param {Date} val A Date object
   * @returns
   */
  date(val) {
    this._payload.service = 'set_datetime';
    this._payload.data = {
      timestamp: Math.round(val.getTime() / 1000)
    };
    return this;
  }
}
exports.Service = Service;