import { EntityDomain, EntityId } from '../types';
import { SwitchService } from './switch-service';

export function newLightService(entity_id: EntityId): LightService {
  return new LightService(entity_id);
}

/**
 * Payload builder for service call
 */
export class LightService extends SwitchService {
  // _domain = 'light';
  _domain(): EntityDomain {
    return 'light';
  }

  percentage(val: number): this {
    this._payload.service = 'set_percentage';
    this._payload.data = {
      percentage: val
    };
    return this;
  }
}
