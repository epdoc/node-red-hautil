import { LightService } from './light-service';
import { LogOpts } from './service';
import { EntityDomain, EntityId } from './types';

export function newFanService(entity_id: EntityId, opts: LogOpts) {
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
