"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightService = exports.newLightService = void 0;
const switch_service_1 = require("./switch-service");
function newLightService(entity_id, opts) {
    return new LightService(entity_id, opts);
}
exports.newLightService = newLightService;
/**
 * Payload builder for service call
 */
class LightService extends switch_service_1.SwitchService {
    // _domain = 'light';
    _domain() {
        return 'light';
    }
    percentage(val) {
        this._payload.service = 'set_percentage';
        this._payload.data = {
            percentage: val,
        };
        return this;
    }
}
exports.LightService = LightService;
//# sourceMappingURL=light-service.js.map