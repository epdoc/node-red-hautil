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
  describe('basic', () => {
    let history = new LocationHistory(opts);
    it('find none', () => {
      history.person('bob');
      expect(history.found()).toEqual(false);
      expect(history.numFound()).toEqual(0);
    });
    it('cutoff one', () => {
      history.add('bob', g(0), tNow - 500);
      history.person('bob').cutoff(tNow - 2000);
      expect(history.found()).toEqual(true);
      expect(history.numFound()).toEqual(1);
    });
    it('cutoff none', () => {
      history.person('bob').cutoff(tNow);
      expect(history.found()).toEqual(false);
      expect(history.numFound()).toEqual(0);
    });
    it('add and find', () => {
      history.add('bob', g(0), tNow - 500);
      history
        .person('bob')
        .cutoff(tNow - 1000)
        .locations([g(0), g(1), g(2)]);
      expect(history.found()).toEqual(true);
      expect(history.numFound()).toEqual(1);
      history
        .person('andy')
        .cutoff(tNow - 1000)
        .locations([g(0), g(1), g(2)]);
      expect(history.numFound()).toEqual(0);
      history
        .person('bob')
        .cutoff(tNow - 400)
        .locations([g(0), g(1), g(2)]);
      expect(history.numFound()).toEqual(0);
      history
        .person('bob')
        .cutoff(tNow - 550)
        .locations([g(0), g(1), g(2)]);
      expect(history.numFound()).toEqual(1);
      history
        .person('bob')
        .cutoff(tNow - 550)
        .locations([g(1), g(2)]);
      expect(history.numFound()).toEqual(0);
      history.person('bob').cutoff(tNow - 550, g(0));
      expect(history.numFound()).toEqual(1);
    });
    it('moving one location fail', () => {
      history
        .person('bob')
        .cutoff(tNow - 2000)
        .locations([g(0), g(1)]);
      expect(history.found()).toEqual(true);
      expect(history.moving()).toEqual(true);
      history.locations([g(1), g(0)]);
      expect(history.moving()).toEqual(false);
    });
    it('raw history add', () => {
      history.add('bob', g(0), tNow + 400);
      history.add('bob', g(1), tNow + 500);
      let items = history.history['bob'];
      expect(items).toHaveLength(2);
      expect(items[1].location).toEqual(g(1));
      expect(items[1].time).toEqual(tNow + 500);
      expect(items[0].location).toEqual(g(0));
      expect(items[0].time).toEqual(tNow + 400);
    });
    it('moving two location pass', () => {
      history
        .person('bob')
        .cutoff(tNow - 2000)
        .locations([g(0), g(1)]);
      expect(history.moving()).toEqual(true);
      expect(history.numFound()).toEqual(2);
      history
        .person('bob')
        .cutoff(tNow - 2000)
        .locations([g(1), g(0)]);
      expect(history.moving()).toEqual(false);
    });
    it('moving two location fail', () => {
      history
        .person('bob')
        .cutoff(tNow - 450)
        .locations([g(0), g(1)]);
      expect(history.moving()).toEqual(false);
    });
    it('moving two location wrong order', () => {
      history
        .person('bob')
        .cutoff(tNow - 2000)
        .locations([g(1), g(0)]);
      expect(history.moving()).toEqual(false);
    });
    it('find more', () => {
      history
        .person('bob')
        .cutoff(tNow - 1000)
        .locations([g(0)]);
      expect(history.numFound()).toEqual(1);
      history.person('bob').cutoff(tNow - 1000).locations(g(1));
      expect(history.numFound()).toEqual(1);
    });
    it('prune nothing', () => {
      history.pruneAll(tNow + 300);
      history
        .person('bob')
        .cutoff(tNow - 1000)
        .locations([g(0)]);
      expect(history.numFound()).toEqual(1);
      history.person('bob').cutoff(tNow - 1000).locations(g(1));
      expect(history.numFound()).toEqual(1);
    });
    it('prune one', () => {
      history.pruneAll(tNow + 450);
      history
        .person('bob')
        .cutoff(tNow - 1000)
        .locations([g(0)]);
      expect(history.numFound()).toEqual(0);
      history.person('bob').cutoff(tNow - 1000).locations(g(1));
      expect(history.numFound()).toEqual(1);
      history.person('bob').cutoff(tNow + 501).locations(g(1));
      expect(history.numFound()).toEqual(0);
    });
    it('pre flush raw', () => {
      expect(db.gate_history).toBeUndefined();
    });
    it('flush raw', () => {
      history.add('bob', g(2),tNow + 600);
      history.flush();
      expect(db.gate_history).toBeDefined();
      expect(db.gate_history.bob).toHaveLength(2);
    });
    it('read', () => {
      history.flush();
      history.history = {};
      history.read();
      expect(db.gate_history.bob).toHaveLength(2);
      history
        .person('bob')
        .cutoff(tNow - 1000)
        .locations([g(1)]);
      expect(history.numFound()).toEqual(1);
      history
        .person('bob')
        .cutoff(tNow - 1000)
        .locations(g(2));
      expect(history.numFound()).toEqual(1);
    });
  });
});
