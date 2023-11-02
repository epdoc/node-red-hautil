import { Service } from './service';
import { EntityDomain, EntityId, NodeRedOpts } from './types';
export type AlarmServiceArmType = 'home' | 'away' | 'night' | 'vacation' | 'custom_bypass' | 'trigger';
export declare function isAlarmServiceArmType(val: any): val is AlarmServiceArmType;
export declare function newAlarmService(entity_id: EntityId, opts?: NodeRedOpts): AlarmService;
/**
 * Payload builder for alarm_control_panel
 */
export declare class AlarmService extends Service {
    _domain(): EntityDomain;
    /**
     * Shortcut to set service to alarm_disarm.
     * @returns
     */
    disarm(): this;
    arm(type: AlarmServiceArmType): this;
}
