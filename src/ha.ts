import { Entity } from './entity';
import { EntityState } from './entity-state';
import { FunctionNodeBase } from './function-node-base';
import { EntityId, NodeRedOpts } from './types';

export type HomeAssistant = any;
export type HaSensorDictEntry = {
  id: EntityId;
  name?: string;
  type?: 'number' | 'boolean' | 'int' | 'integer';
  entity?: Entity;
  val?: number | string;
  on?: boolean;
  off?: boolean;
  defval?: number | string;
};
export type HaSensorDict = Record<string, HaSensorDictEntry>;

export function newHA(opts: NodeRedOpts) {
  return new HA(opts);
}

/**
 * Class wraps a home assistant object, for use in Node-RED functions.
 */
export class HA extends FunctionNodeBase {
  protected _ha: HomeAssistant;

  /**
   *
   * @param {Object} globalHomeAssistant The value of global.get('homeassistant')
   * @param {Function} options.log Function that takes a string as a parameter and that outputs log messages.
   */
  constructor(opts: NodeRedOpts) {
    super(opts);
    this._ha = this.global.get('homeassistant');
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
