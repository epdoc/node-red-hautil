import { Integer } from 'epdoc-util';
export type HomeAssistantEntityState = any;
export declare class EntityState {
    private _state;
    constructor(state: HomeAssistantEntityState);
    equals(val: any): boolean;
    isOn(): boolean;
    isOff(): boolean;
    asNumber(defval?: number): number | undefined;
    asInt(defval?: Integer): Integer | undefined;
    asInteger(defval?: Integer): Integer | undefined;
    toString(): string;
    value(): any;
}
