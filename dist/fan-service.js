"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanService = exports.newFanService = void 0;
const light_service_1 = require("./light-service");
function newFanService(entity_id, opts) {
    return new FanService(entity_id, opts);
}
exports.newFanService = newFanService;
/**
 * Payload builder for service call
 */
class FanService extends light_service_1.LightService {
    // _domain = 'fan';
    _domain() {
        return 'fan';
    }
}
exports.FanService = FanService;
//# sourceMappingURL=fan-service.js.map