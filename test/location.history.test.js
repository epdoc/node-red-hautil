import { LocationHistory } from '../src';

function g(i) {
  return 'g' + i;
}

describe('LocationHistory', () => {
  const tNow = new Date().getTime();
  let db = {};
  const LOCATIONS = [];
  const getStorage = function (key) {
    return db[key];
  };
  const setStorage = function (key, val) {
    db[key] = val;
  };
  let opts = {
    getStorage: getStorage,
    setStorage: setStorage,
  };
  describe('default', () => {
    let history = new LocationHistory(opts);
    it('find none', () => {
      let r = history.find('bob', tNow - 2000, [g(0), g(1), g(2)]);
      expect(r).toEqual(false);
    });
    it('add and find', () => {
      history.add('bob', g(0), tNow - 500);
      let r = history.find('bob', tNow - 1000, [g(0), g(1), g(2)]);
      expect(r).toEqual(true);
      r = history.find('andy', tNow - 1000, [g(0), g(1), g(2)]);
      expect(r).toEqual(false);
      r = history.find('bob', tNow - 400, [g(0), g(1), g(2)]);
      expect(r).toEqual(false);
      r = history.find('bob', tNow - 550, [g(0), g(1), g(2)]);
      expect(r).toEqual(true);
      r = history.find('bob', tNow - 550, [g(1), g(2)]);
      expect(r).toEqual(false);
      r = history.find('bob', tNow - 550, g(0));
      expect(r).toEqual(true);
    });
    it('add more', () => {
      history.add('bob', g(0), tNow + 400);
      history.add('bob', g(1), tNow + 500);
      let items = history.history['bob'];
      expect(items).toHaveLength(2);
      expect(items[1].location).toEqual(g(1));
      expect(items[1].time).toEqual(tNow + 500);
      expect(items[0].location).toEqual(g(0));
      expect(items[0].time).toEqual(tNow + 400);
    });
    it('find more', () => {
      let r = history.find('bob', tNow - 1000, [g(0)]);
      expect(r).toEqual(true);
      r = history.find('bob', tNow - 1000, g(1));
      expect(r).toEqual(true);
    });
    it('prune nothing', () => {
      history.prune(tNow + 300);
      let r = history.find('bob', tNow - 1000, [g(0)]);
      expect(r).toEqual(true);
      r = history.find('bob', tNow - 1000, g(1));
      expect(r).toEqual(true);
    });
    it('prune one', () => {
      history.prune(tNow + 450);
      let r = history.find('bob', tNow - 1000, [g(0)]);
      expect(r).toEqual(false);
      r = history.find('bob', tNow - 1000, g(1));
      expect(r).toEqual(true);
      r = history.find('bob', tNow + 501, g(1));
      expect(r).toEqual(false);
    });
    it('pre flush', () => {
      expect(db.gate_history).toBeUndefined();
    });
    it('flush', () => {
      history.add('bob', g(2), tNow + 600);
      history.flush();
      expect(db.gate_history).toBeDefined();
      expect(db.gate_history.bob).toHaveLength(2);
    });
    it('read', () => {
      history.flush();
      history.history = {};
      history.read();
      expect(db.gate_history.bob).toHaveLength(2);
      let r = history.find('bob', tNow - 1000, [g(1)]);
      expect(r).toEqual(true);
      r = history.find('bob', tNow - 1000, g(2));
      expect(r).toEqual(true);
    });
  });
});
