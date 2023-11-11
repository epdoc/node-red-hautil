import { isObject } from 'epdoc-util';
import {
  AlarmService,
  CoverService,
  FanSpeed6Service,
  LightService,
  Service,
  SwitchService,
  newAlarmService,
  newCoverService,
  newFanSpeed6Service,
  newSwitchService
} from '../src';

describe('service', () => {
  describe('fan', () => {
    describe('conversion', () => {
      it('fanSpeedToPercentage', () => {
        expect(FanSpeed6Service.speedToPercentage(0)).toEqual(33);
        expect(FanSpeed6Service.speedToPercentage(1)).toEqual(16);
        expect(FanSpeed6Service.speedToPercentage(2)).toEqual(33);
        expect(FanSpeed6Service.speedToPercentage(3)).toEqual(50);
        expect(FanSpeed6Service.speedToPercentage(4)).toEqual(66);
        expect(FanSpeed6Service.speedToPercentage(5)).toEqual(83);
        expect(FanSpeed6Service.speedToPercentage(6)).toEqual(100);
        expect(FanSpeed6Service.speedToPercentage(9)).toEqual(33);
      });
      it('fanSpeedToPercentage', () => {
        expect(FanSpeed6Service.percentageToSpeed(0)).toEqual(0);
        expect(FanSpeed6Service.percentageToSpeed(100)).toEqual(6);
        expect(FanSpeed6Service.percentageToSpeed(78)).toEqual(5);
        expect(FanSpeed6Service.percentageToSpeed(38)).toEqual(2);
        expect(FanSpeed6Service.percentageToSpeed(10)).toEqual(1);
        expect(FanSpeed6Service.percentageToSpeed(7)).toEqual(0);
      });
    });
    describe('fan', () => {
      it('speed', () => {
        const fan = new FanSpeed6Service('other_room');
        const payload = fan.speed(4).payload();
        expect(isObject(payload)).toEqual(true);
        expect(payload).toEqual({
          target: { entity_id: 'fan.other_room' },
          domain: 'fan',
          service: 'set_percentage',
          data: {
            percentage: 66
          }
        });
      });
      it('on', () => {
        const payload = newFanSpeed6Service('more_rooms').on().payload();
        expect(isObject(payload)).toEqual(true);
        expect(payload).toEqual({
          target: { entity_id: 'fan.more_rooms' },
          domain: 'fan',
          service: 'turn_on'
        });
      });
      it('percentage', () => {
        const fan = newFanSpeed6Service('less_rooms');
        const payload = fan.percentage(50).payload();
        expect(isObject(payload)).toEqual(true);
        expect(payload).toEqual({
          target: { entity_id: 'fan.less_rooms' },
          domain: 'fan',
          service: 'set_percentage',
          data: {
            percentage: 50
          }
        });
      });
      describe('light', () => {
        it('on', () => {
          const light = new LightService('master_bedroom');
          let payload = light.on().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'light.master_bedroom' },
            domain: 'light',
            service: 'turn_on'
          });
        });
        it('off', () => {
          const light = new LightService('light.master_bedroom');
          let payload = light.domain('light').off().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'light.master_bedroom' },
            domain: 'light',
            service: 'turn_off'
          });
        });
      });
      describe('switch', () => {
        it('on', () => {
          const payloadBuilder = new SwitchService('master_bedroom');
          let payload = payloadBuilder.on().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'switch.master_bedroom' },
            domain: 'switch',
            service: 'turn_on'
          });
        });
        it('off', () => {
          const payload = newSwitchService('switch.master_bedroom').off().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'switch.master_bedroom' },
            domain: 'switch',
            service: 'turn_off'
          });
        });
      });
      describe('input_number', () => {
        it('value', () => {
          const payloadBuilder = new Service('input_number.master_bedroom');
          let payload = payloadBuilder.value(32.3).payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'input_number.master_bedroom' },
            domain: 'input_number',
            service: 'set_value',
            data: { value: 32.3 }
          });
        });
        it('increment', () => {
          const payload = new Service('input_number.master_bedroom');
          let result = payload.increment().payload();
          expect(isObject(result)).toEqual(true);
          expect(result).toEqual({
            target: { entity_id: 'input_number.master_bedroom' },
            domain: 'input_number',
            service: 'increment'
          });
        });
      });
      describe('input_boolean', () => {
        it('value', () => {
          const payloadBuilder = new SwitchService('input_boolean.test_alive');
          let payload = payloadBuilder.on().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'input_boolean.test_alive' },
            domain: 'input_boolean',
            service: 'turn_on'
          });
        });
        it('increment', () => {
          const payload = new Service('input_number.master_bedroom');
          let result = payload.increment().payload();
          expect(isObject(result)).toEqual(true);
          expect(result).toEqual({
            target: { entity_id: 'input_number.master_bedroom' },
            domain: 'input_number',
            service: 'increment'
          });
        });
      });
      describe('cover', () => {
        it('close', () => {
          const payload = new CoverService('garage').close().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'cover.garage' },
            domain: 'cover',
            service: 'close_cover'
          });
        });
        it('open', () => {
          const payload = newCoverService('cover.master_bedroom').open().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'cover.master_bedroom' },
            domain: 'cover',
            service: 'open_cover'
          });
        });
        it('stop', () => {
          const builder = new CoverService('master_bedroom');
          let payload = builder.service('stop_cover').payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'cover.master_bedroom' },
            domain: 'cover',
            service: 'stop_cover'
          });
        });
        it('stop2', () => {
          const builder = new CoverService('cover.master_bedroom');
          let payload = builder.stop().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'cover.master_bedroom' },
            domain: 'cover',
            service: 'stop_cover'
          });
        });
      });
      describe('alarm_control_panel', () => {
        it('disarm', () => {
          const payload = new AlarmService('workshop').disarm().payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'alarm_control_panel.workshop' },
            domain: 'alarm_control_panel',
            service: 'alarm_disarm'
          });
        });
        it('arm_away', () => {
          const builder = newAlarmService('alarm_control_panel.workshop');
          let payload = builder.service('alarm_arm_away').payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'alarm_control_panel.workshop' },
            domain: 'alarm_control_panel',
            service: 'alarm_arm_away'
          });
        });
        it('arm_away2', () => {
          const payload = new AlarmService('workshop').arm('away').payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'alarm_control_panel.workshop' },
            domain: 'alarm_control_panel',
            service: 'alarm_arm_away'
          });
        });
        it('arm_night', () => {
          const payload = new AlarmService('workshop').arm('night').payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'alarm_control_panel.workshop' },
            domain: 'alarm_control_panel',
            service: 'alarm_arm_night'
          });
        });
        it('arm_trigger', () => {
          const payload = new AlarmService('workshop').arm('trigger').payload();
          expect(isObject(payload)).toEqual(true);
          expect(payload).toEqual({
            target: { entity_id: 'alarm_control_panel.workshop' },
            domain: 'alarm_control_panel',
            service: 'alarm_trigger'
          });
        });
      });
    });
  });
});
