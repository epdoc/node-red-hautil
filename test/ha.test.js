import { isObject } from 'epdoc-util';
import { HA, newFanSpeed6Service, newService } from '../src';

describe('ha', () => {
  describe('entity data', () => {
    const gHA = {
      homeAssistant: {
        states: {
          entity2: {
            state: 'on',
          },
          entity1: {
            state: 'off',
          },
        },
      },
    };
    let ha = new HA(gHA);

    it('isEntityOn', () => {
      expect(ha.entity('entity2').isOn()).toEqual(true);
      expect(ha.entity('entity1').state().isOff()).toEqual(true);
      expect(ha.entity('entity1').isOn()).toEqual(false);
    });
    it('retrieve sensor data', () => {
      const dict = {
        e1: { id: 'entity1' },
        e2: { id: 'entity2' },
      };
      ha.retrieveSensorsData(dict);
      expect(isObject(dict.e1.entity)).toEqual(true);
      expect(isObject(dict.e2.entity)).toEqual(true);
      expect(dict.e2.entity.state().toString()).toEqual('on');
      expect(dict.e1.entity.isOff()).toEqual(true);
      expect(dict.e1.entity.state().isOff()).toEqual(true);
      expect(dict.e1.entity.state().value()).toEqual('off');
    });
  });

  describe('service payload', () => {
    it('light on', () => {
      const s = newService('light.entity3');
      const p = s.service('turn_on').payload();
      expect(isObject(p)).toEqual(true);
      expect(p).toEqual({
        target: { entity_id: 'light.entity3' },
        domain: 'light',
        service: 'turn_on',
      });
    });
    it('fan speed', () => {
      const p = newFanSpeed6Service('entity4').speed(3).payload();
      expect(isObject(p)).toEqual(true);
      expect(p).toEqual({
        target: { entity_id: 'fan.entity4' },
        domain: 'fan',
        service: 'set_percentage',
        data: { percentage: 50 },
      });
    });
  });
});
