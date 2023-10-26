import { LogOpts, Service } from './service';
import { EntityDomain, EntityId } from './types';

export function newSwitchService(entity_id: EntityId, opts: LogOpts) {
  return new SwitchService(entity_id, opts);
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
  on(): SwitchService {
    this._payload.service = 'turn_on';
    return this;
  }

  /**
   * Shortcut to set service to turn_off.
   * @returns
   */
  off(): SwitchService {
    this._payload.service = 'turn_off';
    return this;
  }
}
