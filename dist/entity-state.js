"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityState = void 0;
class EntityState {
    constructor(state) {
        this._state = state;
    }
    equals(val) {
        return this._state === val;
    }
    isOn() {
        return this.equals('on');
    }
    isOff() {
        return this.equals('off');
    }
    asNumber(defval) {
        return this._state ? parseFloat(this._state) : defval;
    }
    asInt(defval) {
        return this._state ? parseInt(this._state, 10) : defval;
    }
    asInteger(defval) {
        return this.asInt(defval);
    }
    toString() {
        return this._state;
    }
    value() {
        return this._state;
    }
}
exports.EntityState = EntityState;
//# sourceMappingURL=entity-state.js.map