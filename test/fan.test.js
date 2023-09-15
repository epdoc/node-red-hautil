import { HA, setFan } from '../src';

describe('setFan', () => {
  describe('lightning on', () => {
    const gHA = {
      homeAssistant: {
        states: {
          'input_boolean.lightning': {
            state: 'on',
          },
          'switch.master_bedroom': {
            state: 'on',
          },
          'fan.master_bedroom': {
            state: 'on',
          },
        },
      },
    };
    let ha = new HA(gHA);
    function sendMsg(msg) {}
    function logCb(s) {
      console.log(s);
    }

    it('turn off', () => {
      return setFan(
        gHA,
        (payload) => {
          expect(payload).toEqual({
            target: { entity_id: 'fan.master_bedroom' },
            service: 'turn_off',
            domain: 'fan',
          });
        },
        { fan: 'master_bedroom', service: 'on' },
        { log: logCb },
      );
    });
  });
  describe('entity data', () => {
    const gHA = {
      homeAssistant: {
        states: {
          'input_boolean.lightning': {
            state: 'off',
          },
          'switch.master_bedroom': {
            state: 'on',
          },
          'fan.master_bedroom': {
            state: 'on',
          },
        },
      },
    };
    let ha = new HA(gHA);
    function sendMsg(msg) {}
    function logCb(s) {
      console.log(s);
    }
   it('already on', () => {
      return setFan(
        gHA,
        (payload) => {
          expect(payload).toEqual({
            target: { entity_id: 'fan.master_bedroom' },
            service: 'turn_off',
            domain: 'fan',
          });
        },
        { fan: 'master_bedroom', service: 'on' },
        { log: logCb },
      );
    });
  });
  describe('entity data', () => {
    const gHA = {
      homeAssistant: {
        states: {
          'input_boolean.lightning': {
            state: 'off',
          },
          'switch.master_bedroom': {
            state: 'off',
          },
          'fan.master_bedroom': {
            state: 'off',
          },
        },
      },
    };
    let ha = new HA(gHA);
    function sendMsg(msg) {}
    function logCb(s) {
      console.log(s);
    }
    it.skip('timeout', () => {
      return setFan(
        gHA,
        (payload) => {
          expect(payload).toEqual({
            target: { entity_id: 'fan.master_bedroom' },
            service: 'turn_on',
            domain: 'fan',
          });
        },
        { fan: 'master_bedroom', service: 'on', timeout: 5000 },
        { log: logCb },
      );
    });
  });
});
