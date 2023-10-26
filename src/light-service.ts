import { SwitchService } from './switch-service';
import { EntityDomain } from './types';

export function newLightService(entity_id, opts) {
  return new LightService(entity_id, opts);
}

/**
 * Payload builder for service call
 */
export class LightService extends SwitchService {
  // _domain = 'light';
  _domain(): EntityDomain {
    return 'light';
  }

  percentage(val: number) {
    this._payload.service = 'set_percentage';
    this._payload.data = {
      percentage: val,
    };
    return this;
  }
}
