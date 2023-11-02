"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchService = exports.newSwitchService = void 0;
const service_1 = require("./service");
function newSwitchService(entity_id, opts) {
    return new SwitchService(entity_id, opts);
}
exports.newSwitchService = newSwitchService;
/**
 * Payload builder for service call
 */
class SwitchService extends service_1.Service {
    // _domain = 'switch';
    _domain() {
        return 'switch';
    }
    /**
     * Shortcut to set service to turn_on.
     * @returns
     */
    on() {
        this._payload.service = 'turn_on';
        return this;
    }
    /**
     * Shortcut to set service to turn_off.
     * @returns
     */
    off() {
        this._payload.service = 'turn_off';
        return this;
    }
}
exports.SwitchService = SwitchService;
//# sourceMappingURL=switch-service.js.map