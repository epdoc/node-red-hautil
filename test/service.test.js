import { isObject } from 'epdoc-util';
import { newFan } from '../src';
import { Service } from '../src/service';

describe('service', () => {
  describe('fan', () => {
    describe('conversion', () => {
      it('fanSpeedToPercentage', () => {
        expect(Service.fanSpeedToPercentage(0)).toEqual(33);
        expect(Service.fanSpeedToPercentage(1)).toEqual(16);
        expect(Service.fanSpeedToPercentage(2)).toEqual(33);
        expect(Service.fanSpeedToPercentage(3)).toEqual(50);
        expect(Service.fanSpeedToPercentage(4)).toEqual(66);
        expect(Service.fanSpeedToPercentage(5)).toEqual(83);
        expect(Service.fanSpeedToPercentage(6)).toEqual(100);
        expect(Service.fanSpeedToPercentage(9)).toEqual(33);
      });
      it('fanSpeedToPercentage', () => {
        expect(Service.fanPercentageToSpeed(0)).toEqual(0);
        expect(Service.fanPercentageToSpeed(100)).toEqual(6);
        expect(Service.fanPercentageToSpeed(78)).toEqual(5);
        expect(Service.fanPercentageToSpeed(38)).toEqual(2);
        expect(Service.fanPercentageToSpeed(10)).toEqual(1);
        expect(Service.fanPercentageToSpeed(7)).toEqual(0);
      });
    });
    describe('generation', () => {
      it('speed', () => {
        const fan = new Service('fan.master_bedroom');
        const result = fan.speed(4).payload();
        expect(isObject(result)).toEqual(true);
        expect(result).toEqual({
          target: { entity_id: 'fan.master_bedroom' },
          domain: 'fan',
          service: 'set_percentage',
          data: {
            percentage: 66,
          },
        });
      });
      it('service payload', () => {
        const fan = newFan('master_bedroom');
        const result = fan.service('on').payload();
        expect(isObject(result)).toEqual(true);
        expect(result).toEqual({
          target: { entity_id: 'fan.master_bedroom' },
          domain: 'fan',
          service: 'turn_on',
        });
      });
      it('speed payload', () => {
        const fan = newFan('master_bedroom');
        const result = fan.percentage(50).payload();
        expect(isObject(result)).toEqual(true);
        expect(result).toEqual({
          target: { entity_id: 'fan.master_bedroom' },
          domain: 'fan',
          service: 'set_percentage',
          data: {
            percentage: 50,
          },
        });
      });
    });
  });
});
