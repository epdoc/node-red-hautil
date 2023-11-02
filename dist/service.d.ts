import { Dict, Integer } from 'epdoc-util';
import { FunctionNodeBase } from './function-node-base';
import { EntityDomain, EntityId, EntityService, NodeRedOpts } from './types';
export type ServicePayloadTarget = {
    entity_id: EntityId;
};
export type ServiceDataDict = Dict | {
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
export declare function newService(entity_id: EntityId, opts?: NodeRedOpts): Service;
/**
 * Payload builder for Call Service node.
 */
export declare class Service extends FunctionNodeBase {
    protected _payload: ServicePayload;
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
    constructor(entity_id: EntityId, opts?: NodeRedOpts);
    private initPayload;
    _domain(): EntityDomain | undefined;
    get entity_id(): EntityId;
    /**
     * Call if you wish to override the domain that is automatically determined
     * from the entity_id that has been provided to the constructor.
     * @param {string} val The domain string (e.g. 'fan' or 'light')
     * @returns this
     */
    domain(val: EntityDomain): this;
    /**
     * Set the service field, for example 'turn_on'.
     * @param {string} val The string to use in a service field.
     * @returns
     */
    service(val: EntityService): this;
    /**
     * Returns the payload dictionary that can be set in msg.payload when using
     * the Call Service node.
     * @returns The payload dictionary
     */
    payload(): ServicePayload;
    /**
     * Increment a value. Applies only to service calls that support 'increment'.
     * @returns this
     */
    increment(): this;
    /**
     * Decrement a value. Applies only to service calls that support `decrement`.
     * @returns this
     */
    decrement(): this;
    /**
     * Use the `set_value` service and set the value. Applies only to service
     * calls that support `set_value`.
     * @param {*} val
     * @returns
     */
    value(val: any): this;
    /**
     * Set a date. Applies only to service calls that support `set_datetime`. Note
     * that we are using the form of `set_datetime` that uses `timestamp` and the
     * number of seconds since the epoch.
     * @param {Date} val A Date object
     * @returns
     */
    date(val: Date): this;
}
