import { isDate } from 'epdoc-util';
import { googleDate, msToObj } from '../src';

describe('util', () => {
  describe('googleDate', () => {
    it('js origin date', () => {
      let d = new Date(0);
      expect(isDate(d)).toBe(true);
      expect(d.toISOString()).toBe('1970-01-01T00:00:00.000Z');
      let r = googleDate(d);
      expect(r).toBeCloseTo(25568.75, 5);
    });
    it('today', () => {
      let d = new Date('2023-09-11T21:18:52.070Z');
      expect(isDate(d)).toBe(true);
      expect(d.toISOString()).toBe('2023-09-11T21:18:52.070Z');
      let r = googleDate(d);
      expect(r).toBeCloseTo(45180.63810266204, 8);
    });
  });
  describe('msToObj', () => {
    it('0 ms', () => {
      let r = msToObj(0);
      expect(r).toEqual({
        timestring: '0:00',
        notistring: '0 seconds',
        s: 0,
        m: 0,
        h: 0,
        d: 0,
      });
    });
    it('1000 ms', () => {
      let r = msToObj(1000);
      expect(r).toEqual({
        timestring: '0:01',
        notistring: '1 seconds',
        s: 1,
        m: 0,
        h: 0,
        d: 0,
      });
    });
    it('more', () => {
      let r = msToObj(723492);
      expect(r).toEqual({
        timestring: '12:03',
        notistring: '12 minutes 3 seconds',
        s: 3,
        m: 12,
        h: 0,
        d: 0,
      });
    });
  });
});
