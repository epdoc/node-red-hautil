import { SwitchService } from './switch-service';
import { EntityDomain, EntityId, NodeRedOpts } from './types';
export declare function newLightService(entity_id: EntityId, opts?: NodeRedOpts): LightService;
/**
 * Payload builder for service call
 */
export declare class LightService extends SwitchService {
    _domain(): EntityDomain;
    percentage(val: number): this;
}
