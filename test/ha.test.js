import { isObject } from 'epdoc-util';
import { HA } from '../src';

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
      expect(ha.isEntityOn('entity2')).toEqual(true);
      expect(ha.isEntityOn('entity1')).toEqual(false);
    });
    it('retrieve sensor data', () => {
      const dict = {
        e1: { id: 'entity1' },
        e2: { id: 'entity2' },
      };
      ha.retrieveSensorsData(dict);
      expect(isObject (dict.e1.obj)).toEqual(true);
      expect(isObject(dict.e2.obj)).toEqual(true);
      expect(dict.e2.state).toEqual('on');
      expect(dict.e1.state).toEqual('off');
    });
  });

  describe('service payload', () => {
    it('light on', () => {
      const params = {
        service: 'on',
        entity_id: 'light.entity3',
      };
      const p = HA.getServicePayload(params);
      expect(isObject(p)).toEqual(true);
      expect(isObject(p.target)).toEqual(true);
      expect(p.service).toEqual('turn_on');
      expect(p.target.entity_id).toEqual(params.entity_id);
      expect(p.domain).toEqual('light');
    });
    it('fan speed', () => {
      const params = {
        service: 'speed',
        entity_id: 'fan.entity4',
        speed: 3,
      };
      const p = HA.getServicePayload(params);
      expect(isObject(p)).toEqual(true);
      expect(isObject(p.target)).toEqual(true);
      expect(p.target.entity_id).toEqual('fan.entity4');
      expect(isObject(p.data)).toEqual(true);
      expect(p.service).toEqual('set_percentage');
      expect(p.target.entity_id).toEqual(params.entity_id);
      expect(p.domain).toEqual('fan');
      expect(p.data.percentage).toEqual(50);
    });
  });
});
