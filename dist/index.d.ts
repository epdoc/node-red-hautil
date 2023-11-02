export function newSwitchService(entity_id: any, opts: any): SwitchService;
export function newService(entity_id: any, opts: any): Service;
export function newLightService(entity_id: any, opts: any): LightService;
export function newHA(globalHomeAssistant: any, opts: any): HA;
export function newFanSpeed6Service(entity_id: any, opts: any): FanSpeed6Service;
export function newFanService(entity_id: any, opts: any): FanService;
export function newCoverService(entity_id: any, opts: any): CoverService;
export function newAlarmService(entity_id: any, opts: any): Service;
export function isLogFunction(val: any): any;
export function isFanSpeed6Speed(val: any): any;
export function isAlarmServiceArmType(val: any): boolean;
export class SwitchService extends Service {
    constructor(...args: any[]);
    _domain(): string;
    on(): this;
    off(): this;
}
export class Service extends FunctionLog {
    constructor(entity_id: any, opts: any);
    _payload: {
        target: {
            entity_id: string;
        };
    };
    initPayload(entity_id: any): this;
    _domain(): void;
    get entity_id(): string;
    domain(val: any): this;
    service(val: any): this;
    payload(): {
        target: {
            entity_id: string;
        };
    };
    increment(): this;
    decrement(): this;
    value(val: any): this;
    date(val: any): this;
}
export class LightService extends SwitchService {
    percentage(val: any): this;
}
export class HA extends FunctionLog {
    constructor(globalHomeAssistant: any, opts: any);
    _ha: any;
    get ha(): any;
    entity(entity_id: any): Entity;
    entityState(entity_id: any): EntityState | undefined;
    retrieveSensorsData(sensorDict: any): void;
}
export class FunctionLog {
    constructor(opts: any);
    info: () => void;
    warn: () => void;
    initLog(opts: any): this;
}
export class FanSpeed6Service extends FanService {
    static speedToPercentage(speed: any): number;
    static percentageToSpeed(percentage: any): number;
    speed(val: any): this;
}
export class FanService extends LightService {
}
export class EntityState {
    constructor(state: any);
    _state: any;
    equals(val: any): boolean;
    isOn(): boolean;
    isOff(): boolean;
    asNumber(defval: any): any;
    asInt(defval: any): any;
    asInteger(defval: any): any;
    toString(): any;
    value(): any;
}
export class Entity {
    constructor(entity: any);
    _entity: any;
    state(): EntityState;
    exists(): boolean;
    isOn(): boolean;
    isOff(): boolean;
    asNumber(defval: any): any;
    asInt(defval: any): any;
    asInteger(defval: any): any;
    speed(defval: any): any;
}
export class CoverService extends Service {
    constructor(...args: any[]);
    _domain(): string;
    close(): this;
    open(): this;
    stop(): this;
}
export class AlarmService extends Service {
    constructor(...args: any[]);
    _domain(): string;
    disarm(): this;
    arm(type: any): this;
}
