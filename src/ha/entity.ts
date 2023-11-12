import { Dict, Integer, deepCopy, isDefined } from 'epdoc-util';
import { FanSpeed6Service } from '../services/fan-speed6-service';
import { EntityId } from '../types';
import { EntityAttributes, HAEntityAttributesData } from './entity-attributes';
import { EntityState, HAEntityStateData } from './entity-state';

export type HAEntityData = Dict & {
  entity_id: EntityId;
  state: HAEntityStateData;
  last_changed: string;
  last_updated: string;
  attributes: HAEntityAttributesData;
  context: Dict;
};

// const sample: Dict = {
//   entity_id: 'input_boolean.lightning',
//   state: 'off',
//   attributes: { editable: true, icon: 'mdi:flash-alert', friendly_name: 'Lightning' },
//   context: { id: '01HETE7D85ENSCR7B5MAJN3AK6', parent_id: null, user_id: null },
//   last_changed: '2023-11-09T16:21:43.813Z',
//   last_updated: '2023-11-09T16:21:43.813Z'
// };

export class Entity {
  private _entity: HAEntityData | undefined;
  private _state: EntityState;
  private _attributes: EntityAttributes;

  constructor(entity?: HAEntityData) {
    this._entity = entity;
    this._state = new EntityState(entity ? entity.state : undefined);
    this._attributes = new EntityAttributes(entity ? entity.attributes : undefined);
  }
  state(): EntityState {
    return this._state;
  }
  attributes(): EntityAttributes {
    return this._attributes;
  }

  isValid(): this is Entity {
    return Entity.isEntity(this);
  }

  static isEntity(val: any): val is Entity {
    return val && isDefined(val._entity) && isDefined(val._state) && val._state.isValid();
  }

  get entityId(): EntityId {
    return this._entity ? this._entity.entity_id : 'undefined';
  }

  get name(): string | undefined {
    return this._attributes.name;
  }

  exists(): boolean {
    return this._entity ? true : false;
  }

  value(): any {
    if (this._attributes.isNumberClass()) {
      return this.state().asNumber();
    }
    return this.state().value();
  }

  isOn(): boolean {
    return this.state().isOn();
  }
  isOff(): boolean {
    return this.state().isOff();
  }
  asNumber(defval?: number): number | undefined {
    return this.state().asNumber(defval);
  }
  asInt(defval?: Integer): Integer | undefined {
    return this.state().asInt(defval);
  }
  asInteger(defval?: Integer): Integer | undefined {
    return this.asInt(defval);
  }

  speed(defval?: Integer): Integer | undefined {
    return FanSpeed6Service.percentageToSpeed(this.attributes.prototype(defval));
  }

  get lastChanged(): Date {
    return this._entity ? new Date(this._entity.last_changed) : new Date(0);
  }
  get lastUpdated(): Date {
    return this._entity ? new Date(this._entity.last_updated) : new Date(0);
  }

  toObject(): Dict {
    let result: Dict = deepCopy(this._entity);
    result.state = this._state.toObject();
    result.attributes = this._attributes.toObject();
    return result;
  }
  stringify(): string {
    return JSON.stringify(this.toObject());
  }
}
