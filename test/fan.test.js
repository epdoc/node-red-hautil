import { isObject } from 'epdoc-util';
import { Fan } from '../src';

describe('speed', () => {
  describe('conversion', () => {
    it('speedToPercentage', () => {
      expect(Fan.speedToPercentage(0)).toEqual(33);
      expect(Fan.speedToPercentage(1)).toEqual(16);
      expect(Fan.speedToPercentage(2)).toEqual(33);
      expect(Fan.speedToPercentage(3)).toEqual(50);
      expect(Fan.speedToPercentage(4)).toEqual(66);
      expect(Fan.speedToPercentage(5)).toEqual(83);
      expect(Fan.speedToPercentage(6)).toEqual(100);
      expect(Fan.speedToPercentage(9)).toEqual(33);
    });
    it('speedToPercentage', () => {
      expect(Fan.percentageToSpeed(0)).toEqual(0);
      expect(Fan.percentageToSpeed(100)).toEqual(6);
      expect(Fan.percentageToSpeed(78)).toEqual(5);
      expect(Fan.percentageToSpeed(38)).toEqual(2);
      expect(Fan.percentageToSpeed(10)).toEqual(1);
      expect(Fan.percentageToSpeed(7)).toEqual(0);
    });
  });
  describe('generation', () => {
    it('speed', () => {
      const fan = new Fan('master_bedroom');
      const result = fan.speed(4);
      expect(isObject(result)).toEqual(true);
      expect(result.entity_id).toEqual('fan.bond_master_bedroom');
      expect(result.percentage).toEqual(66);
    });
    it('service payload', () => {
      const fan = new Fan('master_bedroom');
      const result = fan.toServicePayload('on');
      expect(isObject(result)).toEqual(true);
      expect(isObject(result.target)).toEqual(true);
      expect(result.target.entity_id).toEqual('fan.bond_master_bedroom');
      expect(result.service).toEqual('turn_on');
      expect(result.domain).toEqual('fan');
    });
    it('speed payload', () => {
      const fan = new Fan('master_bedroom');
      const result = fan.toSpeedServicePayload(4);
      expect(isObject(result)).toEqual(true);
      expect(isObject(result.target)).toEqual(true);
      expect(isObject(result.data)).toEqual(true);
      expect(result.target.entity_id).toEqual('fan.bond_master_bedroom');
      expect(result.data.percentage).toEqual(66);
      expect(result.service).toEqual('set_percentage');
      expect(result.domain).toEqual('fan');
    });
  });
});
