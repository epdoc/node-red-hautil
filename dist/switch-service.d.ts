import { Service } from './service';
import { EntityDomain, EntityId, NodeRedOpts } from './types';
export declare function newSwitchService(entity_id: EntityId, opts?: NodeRedOpts): SwitchService;
/**
 * Payload builder for service call
 */
export declare class SwitchService extends Service {
    _domain(): EntityDomain;
    /**
     * Shortcut to set service to turn_on.
     * @returns
     */
    on(): this;
    /**
     * Shortcut to set service to turn_off.
     * @returns
     */
    off(): this;
}
