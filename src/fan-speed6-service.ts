import { Integer, isInteger } from 'epdoc-util';
import { FanService } from './fan-service';
import { EntityId } from './types';

export type FanSpeed6Speed = Integer;
export function isFanSpeed6Speed(val: any): val is FanSpeed6Speed {
  return isInteger(val) && val >= 0 && val <= 6;
}

export function newFanSpeed6Service(entity_id: EntityId): FanSpeed6Service {
  return new FanSpeed6Service(entity_id);
}
const FAN_PERCENTAGES = [0, 16, 33, 50, 66, 83, 100];
const FAN_LIMITS = [-1, 8, 25, 42, 58, 75, 92, 100];

/**
 * Payload builder for service call
 */
export class FanSpeed6Service extends FanService {
  speed(val: FanSpeed6Speed) {
    return this.percentage(FanSpeed6Service.speedToPercentage(val));
  }

  static speedToPercentage(speed: FanSpeed6Speed): number {
    let sp = speed;
    if (speed < 1 || speed >= FAN_PERCENTAGES.length) {
      sp = 2;
    }
    return FAN_PERCENTAGES[sp];
  }

  static percentageToSpeed(percentage: number): FanSpeed6Speed {
    for (let pdx = 0; pdx <= 6; ++pdx) {
      if (percentage > FAN_LIMITS[pdx] && percentage <= FAN_LIMITS[pdx + 1]) {
        return pdx;
      }
    }
    return 0;
  }
}
