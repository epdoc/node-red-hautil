import { Integer } from 'epdoc-util';
import { FanService } from './fan-service';
import { EntityId, NodeRedOpts } from './types';
export type FanSpeed6Speed = Integer;
export declare function isFanSpeed6Speed(val: any): val is FanSpeed6Speed;
export declare function newFanSpeed6Service(entity_id: EntityId, opts?: NodeRedOpts): FanSpeed6Service;
/**
 * Payload builder for service call
 */
export declare class FanSpeed6Service extends FanService {
    speed(val: FanSpeed6Speed): this;
    static speedToPercentage(speed: FanSpeed6Speed): number;
    static percentageToSpeed(percentage: number): FanSpeed6Speed;
}
