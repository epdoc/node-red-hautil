import { isDict, isObject } from 'epdoc-util';
import { HA, HaSensorDict, NodeRedOptsMock, newFanSpeed6Service, newService } from '../src';

describe('ha', () => {
  const mock: NodeRedOptsMock = new NodeRedOptsMock();

  describe('entity', () => {
    mock.setStates({
      entity4: {
        state: '3.22',
      },
      entity3: {
        state: '3.22',
      },
      entity2: {
        state: 'on',
      },
      entity1: {
        state: 'off',
      },
    });
    let ha = new HA(mock.opts);

    it('isEntityOn', () => {
      expect(ha.entity('entity2').isOn()).toEqual(true);
      expect(ha.entity('entity1').state().isOff()).toEqual(true);
      expect(ha.entity('entity1').isOn()).toEqual(false);
    });
    it('exists', () => {
      expect(ha.entity('entity2').exists()).toEqual(true);
      expect(ha.entity('entity1').exists()).toEqual(true);
      expect(ha.entity('entity99').exists()).toEqual(false);
    });

    it('retrieve sensor data', () => {
      const dict: HaSensorDict = {
        e1: { id: 'entity1' },
        e2: { id: 'entity2' },
        e3: { id: 'entity3', type: 'number' },
        e4: { id: 'entity4', type: 'int' },
      };
      ha.retrieveSensorsData(dict);
      expect(isObject(dict.e1.entity)).toEqual(true);
      expect(isObject(dict.e2.entity)).toEqual(true);
      expect(isObject(dict.e3.entity)).toEqual(true);
      expect(isObject(dict.e4.entity)).toEqual(true);
      expect(dict.e4.entity && dict.e4.entity.asInteger()).toEqual(3);
      expect(dict.e3.entity && dict.e3.entity.asNumber()).toEqual(3.22);
      expect(dict.e2.entity && dict.e2.entity.state().toString()).toEqual('on');
      if (isDict(dict.e1.entity)) {
        expect(dict.e1.entity.isOff()).toEqual(true);
        expect(dict.e1.entity.state().isOff()).toEqual(true);
        expect(dict.e1.entity.state().value()).toEqual('off');
      }
    });
  });

  describe('service payload', () => {
    it('light on', () => {
      const s = newService('light.entity3', mock.opts);
      const p = s.service('turn_on').payload();
      expect(isObject(p)).toEqual(true);
      expect(p).toEqual({
        target: { entity_id: 'light.entity3' },
        domain: 'light',
        service: 'turn_on',
      });
    });
    it('fan speed', () => {
      const p = newFanSpeed6Service('entity4', mock.opts).speed(3).payload();
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
