"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverService = exports.newCoverService = void 0;
const service_1 = require("./service");
function newCoverService(entity_id, opts) {
    return new CoverService(entity_id, opts);
}
exports.newCoverService = newCoverService;
/**
 * Payload builder for service call
 */
class CoverService extends service_1.Service {
    // _domain = 'cover';
    _domain() {
        return 'cover';
    }
    /**
     * Shortcut to set service to close_cover.
     * @returns
     */
    close() {
        this._payload.service = 'close_cover';
        return this;
    }
    /**
     * Shortcut to set service to open_cover.
     * @returns
     */
    open() {
        this._payload.service = 'open_cover';
        return this;
    }
    stop() {
        this._payload.service = 'stop_cover';
        return this;
    }
}
exports.CoverService = CoverService;
//# sourceMappingURL=cover-service.js.map