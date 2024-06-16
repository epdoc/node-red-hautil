import { Dict, isDict, isFunction, isObject } from '@epdoc/typeutil';
import { EntityId, NodeContextGlobalData, isNodeContextData } from '../types';
import { Entity } from './entity';
import { EntityState } from './entity-state';

export interface HomeAssistant {
  states: Record<EntityId, Entity>;
}
export function isHomeAssistant(val: any): val is HomeAssistant {
  return isObject(val) && isDict(val.states) && isFunction(val.get);
}
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
   * @param val A global NodeContextData object (with methods get, set, keys) or
   * a HomeAssistant object (with property `states`).
   * @param server If val is global, then the HomeAssistant object is retrieved
   * from global.get('homeassistant')[server]
   */
  constructor(val: NodeContextGlobalData | HomeAssistant, server: string = 'homeAssistant') {
    if (isHomeAssistant(val)) {
      this._ha = val;
    } else if (isNodeContextData(val)) {
      const gHA: Dict = val.get('homeassistant') as Dict;
      if (gHA) {
        const haKeys = Object.keys(gHA);
        if (haKeys && haKeys.length === 1) {
          this._ha = gHA[haKeys[0]];
        } else if (haKeys && haKeys.length > 1) {
          this._ha = gHA[server];
        }
      }
    } else {
      throw new Error(
        'HA constructor requires either a homeassistant object or a context object, was passed this instead: ' +
          JSON.stringify(Object.keys(val))
      );
    }
    // @ts-ignore
    if (!isHomeAssistant(this._ha)) {
      throw new Error('HA construction failed');
    }
  }

  // constructor(ha: HomeAssistant) {
  //   this._ha = ha;
  //   if (!this._ha) {
  //     throw new Error('Home Assistant context not found');
  //   }
  //   if (!this._ha || !this._ha.states) {
  //     throw new Error('Home Assistant entity states not found');
  //   }
  // }

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
      // console.log(`found ${entity_id} ${JSON.stringify(item)}`);
      return new Entity(item);
      // } else {
      //   console.log(`Not found ${entity_id}`);
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
