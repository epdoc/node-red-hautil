import { FunctionNodeBase } from './function-node-base';
export function newService(entity_id, opts) {
    return new Service(entity_id, opts);
}
/**
 * Payload builder for Call Service node.
 */
export class Service extends FunctionNodeBase {
    _payload = { target: { entity_id: '' } };
    /**
     * Create a new Service object that is used to create a payload that can be
     * passed to a Call Service node.
     * @param {string} entity_id (required) Can be either the full entity_id of
     * the entity to be controlled (e.g. 'fan.bedroom'), or a partial name (e.g.
     * 'bedroom'). just contain the later part of the entity_id (eg. 'bedroom').
     * @param {function} opts.warn (optional) A logging function for logging
     * warnings. The function takes a single string parameter.
     * @param {function} opts.log (optional) A logging function for logging info
     * messages. The function takes a single string parameter.
     * @param {function} opts.domain (optional) The domain of the entity, if not
     * specified in the entity_id.
     * @param {string} domain Required if domain is not part of entity_id  (e.g.
     * entity_id is 'bedroom' rather than 'fan.bedroom').
     */
    constructor(entity_id, opts) {
        super(opts);
        this.initPayload(entity_id);
    }
    initPayload(entity_id) {
        const domain = this._domain();
        this._payload.target = { entity_id: entity_id };
        this._payload.domain = domain;
        const parts = entity_id.split('.');
        if (parts.length > 1) {
            this._payload.domain = parts[0];
        }
        else if (domain && parts.length < 2) {
            this._payload.target.entity_id = domain + '.' + entity_id;
        }
        return this;
    }
    _domain() {
        return undefined;
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
            this._payload.target.entity_id = val + '.' + this._payload.target.entity_id;
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
            value: val,
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
            timestamp: Math.round(val.getTime() / 1000),
        };
        return this;
    }
}
//# sourceMappingURL=service.js.map