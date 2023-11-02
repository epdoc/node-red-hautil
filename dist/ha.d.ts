import { Entity } from './entity';
import { EntityState } from './entity-state';
import { FunctionNodeBase } from './function-node-base';
import { EntityId, NodeRedOpts } from './types';
export type HomeAssistant = any;
export type HaSensorDictEntry = {
    id: EntityId;
    name?: string;
    type?: 'number' | 'boolean' | 'int' | 'integer';
    entity?: Entity;
    val?: number | string;
    on?: boolean;
    off?: boolean;
    defval?: number | string;
};
export type HaSensorDict = Record<string, HaSensorDictEntry>;
export declare function newHA(opts: NodeRedOpts): HA;
/**
 * Class wraps a home assistant object, for use in Node-RED functions.
 */
export declare class HA extends FunctionNodeBase {
    protected _ha: HomeAssistant;
    /**
     *
     * @param {Object} globalHomeAssistant The value of global.get('homeassistant')
     * @param {Function} options.log Function that takes a string as a parameter and that outputs log messages.
     */
    constructor(opts: NodeRedOpts);
    get ha(): HomeAssistant;
    /**
     *
     * @param {string} entity_id
     * @returns The entity object for the specified `entity_id`.
     */
    entity(entity_id: EntityId): Entity;
    /**
     *
     * @param {*} entity_id
     * @returns
     */
    entityState(entity_id: EntityId): EntityState | undefined;
    /**
     * For every entry in a dictionary, uses the id field to retrieve the Entity() object.
     * @param {Obj} sensorDict Object containing an id property which is an entity_id.
     */
    retrieveSensorsData(sensorDict: HaSensorDict): void;
}
