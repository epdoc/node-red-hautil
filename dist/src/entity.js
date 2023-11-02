import { EntityState } from './entity-state';
import { FanSpeed6Service } from './fan-speed6-service';
export class Entity {
    _entity;
    constructor(entity) {
        this._entity = entity;
    }
    state() {
        return new EntityState(this._entity ? this._entity.state : undefined);
    }
    exists() {
        return this._entity ? true : false;
    }
    isOn() {
        return this.state().isOn();
    }
    isOff() {
        return this.state().isOff();
    }
    asNumber(defval) {
        return this.state().asNumber(defval);
    }
    asInt(defval) {
        return this.state().asInt(defval);
    }
    asInteger(defval) {
        return this.asInt(defval);
    }
    speed(defval) {
        if (this._entity && this._entity.attributes && this._entity.attributes.percentage) {
            return FanSpeed6Service.percentageToSpeed(parseInt(this._entity.attributes.percentage, 10));
        }
        return defval;
    }
}
//# sourceMappingURL=entity.js.map