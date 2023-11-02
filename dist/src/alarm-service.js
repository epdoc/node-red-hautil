import { Service } from './service';
const ARMTYPE = {
    away: 'alarm_arm_away',
    home: 'alarm_arm_home',
    night: 'alarm_arm_night',
    vacation: 'alarm_arm_vacation',
    custom_bypass: 'arm_arm_custom_bypass',
    trigger: 'alarm_trigger',
};
export function isAlarmServiceArmType(val) {
    return ARMTYPE.hasOwnProperty(val);
}
export function newAlarmService(entity_id, opts) {
    return new AlarmService(entity_id, opts);
}
/**
 * Payload builder for alarm_control_panel
 */
export class AlarmService extends Service {
    // _domain = 'alarm_control_panel';
    _domain() {
        return 'alarm_control_panel';
    }
    /**
     * Shortcut to set service to alarm_disarm.
     * @returns
     */
    disarm() {
        this._payload.service = 'alarm_disarm';
        return this;
    }
    arm(type) {
        if (isAlarmServiceArmType(type)) {
            this._payload.service = ARMTYPE[type];
        }
        return this;
    }
}
//# sourceMappingURL=alarm-service.js.map