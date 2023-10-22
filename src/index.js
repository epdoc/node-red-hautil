import pkg from '../package.json';

export * from './alarm-service.js';
export * from './cover-service.js';
export * from './fan-speed6-service.js';
export * from './fan.js';
export * from './ha.js';
export * from './light-service.js';
export * from './location-history.js';
export * from './service.js';
export * from './switch-service.js';

/**
 * The module version number, to make sure Node-RED loaded the right version.
 * @returns Package version number
 */
export function version() {
  return pkg.version;
}
