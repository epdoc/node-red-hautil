import { isDict, isObject } from 'epdoc-util';
import { HA, HaSensorDict, newFanSpeed6Service, newHAFactory, newService } from '../src';
import { NodeRedGlobalMock } from '../src/mocks/node-red-global-mock';

describe('ha', () => {
  describe('entity', () => {
    const gMock: NodeRedGlobalMock = new NodeRedGlobalMock();
    gMock.setStates({
      entity4: {
        state: '3.22'
      },
      entity3: {
        state: '3.22'
      },
      entity2: {
        state: 'on'
      },
      entity1: {
        state: 'off'
      }
    });
    // @ts-ignore
    let factory = newHAFactory(gMock);
    let ha = factory.make();

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
        e4: { id: 'entity4', type: 'int' }
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
      const s = newService('light.entity3');
      const p = s.service('turn_on').payload();
      expect(isObject(p)).toEqual(true);
      expect(p).toEqual({
        target: { entity_id: 'light.entity3' },
        domain: 'light',
        service: 'turn_on'
      });
    });
    it('fan speed', () => {
      const p = newFanSpeed6Service('entity4').speed(3).payload();
      expect(isObject(p)).toEqual(true);
      expect(p).toEqual({
        target: { entity_id: 'fan.entity4' },
        domain: 'fan',
        service: 'set_percentage',
        data: { percentage: 50 }
      });
    });
  });

  describe.only('gMock', () => {
    const gMock = new NodeRedGlobalMock();
    // @ts-ignore
    const haFactory = newHAFactory(gMock);
    gMock
      .setEntity('input_boolean.lightning', {
        entity_id: 'input_boolean.lightning',
        state: 'on'
      })
      .setEntity('switch.away_room', {
        entity_id: 'switch.away_room',
        state: 'on',
        attributes: { friendly_name: 'Away Room Fan' }
      })
      .setEntity('fan.away_room', {
        entity_id: 'fan.away_room',
        state: 'on'
      })
      .setEntity('fan.workshop', {
        entity_id: 'fan.workshop',
        state: 'off'
      });
    let ha: HA = haFactory.make();

    it('setEntity', () => {
      const entity1 = ha.entity('switch.away_room');
      // console.log(`entity1 from ha: ${entity1.stringify()}`);
      // console.log(`entity1 from db: ${JSON.stringify(gMock.getEntity('switch.away_room'))}`);
      expect(entity1.entityId).toEqual('switch.away_room');
      expect(entity1.name).toEqual('Away Room Fan');
      expect(entity1.value()).toEqual('on');

      const entity3 = ha.entity('input_boolean.lightning');
      // console.log(`entity3 from ha: ${entity3.stringify()}`);
      expect(entity3.entityId).toEqual('input_boolean.lightning');
      expect(entity3.name).toEqual('input boolean lightning');
      expect(entity3.value()).toEqual('on');

      const entity2 = ha.entity('fan.workshop');
      // console.log(`entity2 from ha: ${entity2.stringify()}`);
      expect(entity2.entityId).toEqual('fan.workshop');
      expect(entity2.name).toEqual('fan workshop');
      expect(entity2.value()).toEqual('off');
    });
    it('setEntityStateValue', (done) => {
      gMock.setEntityStateValue('switch.away_room', 'off');
      const entity1 = ha.entity('switch.away_room');
      // console.log(`entity1 from ha: ${entity1.stringify()}`);
      // console.log(`entity1 from db: ${JSON.stringify(gMock.getEntity('switch.away_room'))}`);
      expect(entity1.entityId).toEqual('switch.away_room');
      expect(entity1.name).toEqual('Away Room Fan');
      expect(entity1.value()).toEqual('off');
      expect(entity1.isOn()).toEqual(false);
      expect(entity1.isOff()).toEqual(true);
      done();
    });
  });
});
