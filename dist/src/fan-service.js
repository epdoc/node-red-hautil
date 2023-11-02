import { LightService } from './light-service';
export function newFanService(entity_id, opts) {
    return new FanService(entity_id, opts);
}
/**
 * Payload builder for service call
 */
export class FanService extends LightService {
    // _domain = 'fan';
    _domain() {
        return 'fan';
    }
}
//# sourceMappingURL=fan-service.js.map