import { HA, setFan } from '../src';

describe('setFan', () => {
  describe('entity data', () => {
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
      return Promise.resolve();
    }

    it('lighting off', () => {
      const opts = {
        log: logCb,
      };
      function sendMsg(payload) {
        return expect(payload).toEqual({
          target: { entity_id: 'fan.master_bedroom' },
          service: 'turn_off',
          domain: 'fan',
        });
      }
      return setFan(gHA, sendMsg, 'master_bedroom', 'on', opts);
    });
    it('already on', () => {
      let idx = 0;
      const opts = {
        log: logCb,
      };
      function sendMsg(payload) {
        return Promise.resolve();
      }
      return setFan(gHA, sendMsg, 'master_bedroom', 'on', opts);
    });
  });
});
