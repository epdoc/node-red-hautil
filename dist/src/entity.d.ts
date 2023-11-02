import { Dict, Integer } from 'epdoc-util';
import { EntityState } from './entity-state';
export type HomeAssistantEntity = Dict;
export declare class Entity {
    private _entity;
    constructor(entity: HomeAssistantEntity);
    state(): EntityState;
    exists(): boolean;
    isOn(): boolean;
    isOff(): boolean;
    asNumber(defval?: number): number | undefined;
    asInt(defval?: Integer): Integer | undefined;
    asInteger(defval?: Integer): Integer | undefined;
    speed(defval?: Integer): number | undefined;
}
