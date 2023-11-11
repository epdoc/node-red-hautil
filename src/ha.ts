import { Entity } from './entity';
import { EntityState } from './entity-state';
import { EntityId, NodeRedGlobalObject } from './types';

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

/**
 * Class wraps a home assistant object, for use in Node-RED functions.
 */
export class HA {
  protected _ha: HomeAssistant;

  /**
   *
   * @param {Object} globalHomeAssistant The value of global.get('homeassistant')
   * @param {Function} options.log Function that takes a string as a parameter and that outputs log messages.
   */
  constructor(global: NodeRedGlobalObject) {
    const gHA = global.get('homeassistant');
    if (gHA) {
      this._ha = gHA.homeAssistant;
    }
    if (!gHA) {
      throw new Error('Home Assistant global not found');
    }
    if (!gHA || !this._ha) {
      throw new Error('Home Assistant context not found');
    }
    if (!gHA || !this._ha || !this._ha.states) {
      throw new Error('Home Assistant entity states not found');
    }
  }

  // xx() {
  //   const gHA = global.get('homeassistant');
  //   const ha = gHA.homeAssistant;
  //   const entity = ha.states[entity_id];
  // 	return entity && entity.state === "on" ? true : false;
  // }

  get ha(): HomeAssistant {
    return this._ha;
  }

  /**
   *
   * @param {string} entity_id
   * @returns The entity object for the specified `entity_id`.
   */
  entity(entity_id: EntityId): Entity {
    if (this._ha.states.hasOwnProperty(entity_id)) {
      const item: any = this._ha.states[entity_id];
      return new Entity(item);
    }
    return new Entity();
  }

  /**
   *
   * @param {*} entity_id
   * @returns
   */
  entityState(entity_id: EntityId): EntityState | undefined {
    const entity: Entity | undefined = this.entity(entity_id);
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
