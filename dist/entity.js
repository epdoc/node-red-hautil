"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const entity_state_1 = require("./entity-state");
const fan_speed6_service_1 = require("./fan-speed6-service");
class Entity {
    constructor(entity) {
        this._entity = entity;
    }
    state() {
        return new entity_state_1.EntityState(this._entity ? this._entity.state : undefined);
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
            return fan_speed6_service_1.FanSpeed6Service.percentageToSpeed(parseInt(this._entity.attributes.percentage, 10));
        }
        return defval;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map