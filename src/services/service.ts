import { Dict, Integer } from '@epdoc/typeutil';
import { EntityDomain, EntityId, EntityService } from '../types';

export type ServicePayloadTarget = {
  entity_id: EntityId;
};
export type ServiceDataDict =
  | Dict
  | {
      value?: number | string;
      timestamp?: number;
      brightness?: number;
      rgb_color?: Integer[];
      temperature?: number;
    };
export type ServicePayload = {
  target: ServicePayloadTarget;
  domain?: EntityDomain;
  service?: EntityService;
  data?: ServiceDataDict;
};

export function newService(entity_id: EntityId): Service {
  return new Service(entity_id);
}

/**
 * Payload builder for Call Service node.
 */
export class Service {
  protected _payload: ServicePayload = { target: { entity_id: '' } };

  /**
   * Create a new Service object that is used to create a payload that can be
   * passed to a Call Service node.
   */
  constructor(entity_id: EntityId) {
    this.initPayload(entity_id);
  }

  private initPayload(entity_id: EntityId): this {
    const domain: EntityDomain | undefined = this._domain();
    this._payload.target = { entity_id: entity_id };
    this._payload.domain = domain;
    const parts = entity_id.split('.');
    if (parts.length > 1) {
      this._payload.domain = parts[0];
    } else if (domain && parts.length < 2) {
      this._payload.target.entity_id = domain + '.' + entity_id;
    }
    return this;
  }

  _domain(): EntityDomain | undefined {
    return undefined;
  }

  get entity_id(): EntityId {
    return this._payload.target.entity_id;
  }

  /**
   * Call if you wish to override the domain that is automatically determined
   * from the entity_id that has been provided to the constructor.
   * @param {string} val The domain string (e.g. 'fan' or 'light')
   * @returns this
   */
  domain(val: EntityDomain): this {
    this._payload.domain = val;
    if (!this._payload.target.entity_id.includes('.')) {
      this._payload.target.entity_id = val + '.' + this._payload.target.entity_id;
    }
    return this;
  }

  /**
   * Set the service field, for example 'turn_on'.
   * @param {string} val The string to use in a service field.
   * @returns
   */
  service(val: EntityService): this {
    this._payload.service = val;
    return this;
  }

  /**
   * Returns the payload dictionary that can be set in msg.payload when using
   * the Call Service node.
   * @returns The payload dictionary
   */
  payload(): ServicePayload {
    return this._payload;
  }

  /**
   * Increment a value. Applies only to service calls that support 'increment'.
   * @returns this
   */
  increment(): this {
    this._payload.service = 'increment';
    return this;
  }

  /**
   * Decrement a value. Applies only to service calls that support `decrement`.
   * @returns this
   */
  decrement(): this {
    this._payload.service = 'decrement';
    return this;
  }

  /**
   * Use the `set_value` service and set the value. Applies only to service
   * calls that support `set_value`.
   * @param {*} val
   * @returns
   */
  value(val: any): this {
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
  date(val: Date): this {
    this._payload.service = 'set_datetime';
    this._payload.data = {
      timestamp: Math.round(val.getTime() / 1000)
    };
    return this;
  }
}
