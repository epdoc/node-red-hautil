import { isFunction } from 'epdoc-util';
import { Service } from './service';

export function newHA(globalHomeAssistant, options) {
  return new HA(globalHomeAssistant, options);
}

export class HA {
  _ha;
  _options;
  _log;

  constructor(globalHomeAssistant, options) {
    this._ha = globalHomeAssistant.homeAssistant;
    this._options = options || {};
    this._log = isFunction(this._options.log) ? this._options.log : null;
  }

  get ha() {
    return this._ha;
  }

  getEntity(entity_id) {
    return this._ha.states[entity_id];
  }

  isEntityOn(entity_id) {
    const entity = this.getEntity(entity_id);
    return entity && entity.state === 'on' ? true : false;
  }

  getEntitySpeed(entity_id) {
    const entity = this.getEntity(entity_id);
    // debug && node.warn(entity_id + " = " + JSON.stringify(entity));
    return entity && entity.attributes ? entity.attributes.percentage : null;
  }

  /**
   *
   * @param {Obj} sensorDict Object containing an id property which is an entity_id.
   */
  retrieveSensorsData(sensorDict) {
    for (const name in sensorDict) {
      if (sensorDict.hasOwnProperty(name)) {
        let item = sensorDict[name];
        item.obj = this.ha.states[item.id];
        if (item.obj) {
          item.state = item.obj.state;
        }
      }
    }
  }

}
