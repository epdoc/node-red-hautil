import { Service } from './service';
import { EntityDomain, EntityId, NodeRedOpts } from './types';
export declare function newCoverService(entity_id: EntityId, opts?: NodeRedOpts): CoverService;
/**
 * Payload builder for service call
 */
export declare class CoverService extends Service {
    _domain(): EntityDomain;
    /**
     * Shortcut to set service to close_cover.
     * @returns
     */
    close(): this;
    /**
     * Shortcut to set service to open_cover.
     * @returns
     */
    open(): this;
    stop(): this;
}
