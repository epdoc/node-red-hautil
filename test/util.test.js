import pkg from '../package.json';
import { version } from '../src';

describe('util', () => {
  describe('version', () => {
    it('version', () => {
      let r = version();
      expect(r).toBe(pkg.version);
    });
  });
});
