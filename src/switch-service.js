import { Service } from './service';

export function newSwitchService(entity_id, opts) {
  return new SwitchService(entity_id, opts);
}

/**
 * Payload builder for service call
 */
export class SwitchService extends Service {
  // _domain = 'switch';

  _domain() {
    return 'switch';
  }

  /**
   * Shortcut to set service to turn_on.
   * @returns
   */
  on() {
    this._payload.service = 'turn_on';
    return this;
  }

  /**
   * Shortcut to set service to turn_off.
   * @returns
   */
  off() {
    this._payload.service = 'turn_off';
    return this;
  }
}
