import pkg from '../package.json';

export * from './fan.js';
export * from './ha.js';
export * from './location-history.js';
export * from './util.js';

/**
 * The module version number, to make sure Node-RED loaded the right version.
 * @returns Package version number
 */
export function version() {
  return pkg.version;
}
