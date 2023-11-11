import { LightService } from './light-service';
import { EntityDomain, EntityId } from './types';

export function newFanService(entity_id: EntityId): FanService {
  return new FanService(entity_id);
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
