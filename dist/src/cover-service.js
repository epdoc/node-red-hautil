import { Service } from './service';
export function newCoverService(entity_id, opts) {
    return new CoverService(entity_id, opts);
}
/**
 * Payload builder for service call
 */
export class CoverService extends Service {
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
//# sourceMappingURL=cover-service.js.map