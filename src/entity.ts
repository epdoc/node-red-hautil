import { Dict, Integer } from 'epdoc-util';
import { EntityState } from './entity-state';
import { FanSpeed6Service } from './fan-speed6-service';

export type HomeAssistantEntity = Dict;

export class Entity {
  private _entity: HomeAssistantEntity;

  constructor(entity: HomeAssistantEntity) {
    this._entity = entity;
  }
  state(): EntityState {
    return new EntityState(this._entity ? this._entity.state : undefined);
  }

  exists(): boolean {
    return this._entity ? true : false;
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

  speed(defval?: Integer) {
    if (this._entity && this._entity.attributes && this._entity.attributes.percentage) {
      return FanSpeed6Service.percentageToSpeed(parseInt(this._entity.attributes.percentage, 10));
    }
    return defval;
  }
}
