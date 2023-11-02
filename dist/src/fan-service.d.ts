import { LightService } from './light-service';
import { EntityDomain, EntityId, NodeRedOpts } from './types';
export declare function newFanService(entity_id: EntityId, opts?: NodeRedOpts): FanService;
/**
 * Payload builder for service call
 */
export declare class FanService extends LightService {
    _domain(): EntityDomain;
}
