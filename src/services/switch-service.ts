import { EntityDomain, EntityId } from '../types';
import { Service } from './service';

export function newSwitchService(entity_id: EntityId): SwitchService {
  return new SwitchService(entity_id);
}

/**
 * Payload builder for service call
 */
export class SwitchService extends Service {
  // _domain = 'switch';

  _domain(): EntityDomain {
    return 'switch';
  }

  /**
   * Shortcut to set service to turn_on.
   * @returns
   */
  on(): this {
    this._payload.service = 'turn_on';
    return this;
  }

  /**
   * Shortcut to set service to turn_off.
   * @returns
   */
  off(): this {
    this._payload.service = 'turn_off';
    return this;
  }
}
