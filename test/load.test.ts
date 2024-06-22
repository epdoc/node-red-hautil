import pkg from '../package.json';
import { hautilInfo } from '../src';

describe('load', () => {
  it('version', () => {
    expect(hautilInfo).toBeDefined();
    expect(hautilInfo.version()).toEqual(pkg.version);
    expect(hautilInfo.name()).toEqual(pkg.name);
    expect(hautilInfo.description()).toEqual(pkg.description);
  });
});
