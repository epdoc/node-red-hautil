import pkg from '../package.json';
import { hautils } from '../src';

describe('load', () => {
  it('version', () => {
    expect(hautils).toBeDefined();
    expect(hautils.version()).toEqual(pkg.version);
    expect(hautils.name()).toEqual(pkg.name);
    expect(hautils.description()).toEqual(pkg.description);
  });
});
