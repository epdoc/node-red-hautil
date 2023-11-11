import { EntityDomain, EntityId } from '../types';
import { LightService } from './light-service';

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
