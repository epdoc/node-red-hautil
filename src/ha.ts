import { Entity } from './entity';
import { EntityState } from './entity-state';
import { FunctionLog, LogOpts } from './function-log';
import { EntityId } from './types';

export type GlobalHomeAssistant = any;
export type HomeAssistant = any;
export type HaSensorDictEntry = {
  id: EntityId;
  name?: string;
  type: 'number' | 'boolean' | 'int' | 'integer' | undefined;
  entity?: Entity;
  val?: number | string;
  on?: boolean;
  off?: boolean;
  defval?: number | string;
};
export type HaSensorDict = Record<string, HaSensorDictEntry>;

export function newHA(globalHomeAssistant: GlobalHomeAssistant, opts: LogOpts) {
  return new HA(globalHomeAssistant, opts);
}

/**
 * Class wraps a home assistant object, for use in Node-RED functions.
 */
export class HA extends FunctionLog {
  protected _ha: HomeAssistant;

  /**
   *
   * @param {Object} globalHomeAssistant The value of global.get('homeassistant')
   * @param {Function} options.log Function that takes a string as a parameter and that outputs log messages.
   */
  constructor(globalHomeAssistant: GlobalHomeAssistant, opts?: LogOpts) {
    super(opts);
    this._ha = globalHomeAssistant.homeAssistant;
  }

  get ha(): HomeAssistant {
    return this._ha;
  }

  /**
   *
   * @param {string} entity_id
   * @returns The entity object for the specified `entity_id`.
   */
  entity(entity_id: EntityId): Entity {
    return new Entity(this._ha.states[entity_id]);
  }

  /**
   *
   * @param {*} entity_id
   * @returns
   */
  entityState(entity_id: EntityId): EntityState | undefined {
    const entity: Entity = this.entity(entity_id);
    return entity ? entity.state() : undefined;
  }

  /**
   * For every entry in a dictionary, uses the id field to retrieve the Entity() object.
   * @param {Obj} sensorDict Object containing an id property which is an entity_id.
   */
  retrieveSensorsData(sensorDict: HaSensorDict) {
    for (const name in sensorDict) {
      if (sensorDict.hasOwnProperty(name)) {
        let item: HaSensorDictEntry = sensorDict[name];
        item.entity = this.entity(item.id);
        if (item.type === 'boolean') {
          if (item.entity.isOn()) {
            item.on = true;
            item.off = false;
          } else if (item.entity.isOff()) {
            item.on = false;
            item.off = true;
          }
        } else if (item.type === 'number') {
          item.val = item.entity.asNumber(item.defval as number);
        } else if (item.type === 'int') {
          item.val = item.entity.asInt(item.defval as number);
        }
      }
    }
  }
}
