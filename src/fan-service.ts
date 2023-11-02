import { LightService } from './light-service';
import { EntityDomain, EntityId, NodeRedOpts } from './types';

export function newFanService(entity_id: EntityId, opts?: NodeRedOpts): FanService {
  return new FanService(entity_id, opts);
}

/**
 * Payload builder for service call
 */
export class FanService extends LightService {
  // _domain = 'fan';

  _domain(): EntityDomain {
    return 'fan';
  }
}
