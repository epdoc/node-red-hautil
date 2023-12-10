import { Dict } from 'epdoc-util';
import { NodeContextGlobalData } from './types';

export * from './function-node-base';
export * from './ha';
export * from './mocks';
export * from './services';
export * from './types';

/**
 * An initialization function to call once when Node-RED has loaded.
 * @param global The global object.
 * @param modules A dictionary of modules to load.
 */
export function loadModules(global: NodeContextGlobalData, modules: Dict) {
  const lib: Dict = {};
  const fail: string[] = [];
  Object.keys(modules).forEach((key) => {
    const pkgName = modules[key];
    lib[key] = global.get(pkgName);
    if (!lib[key]) {
      fail.push(pkgName);
    }
  });
  if (fail.length && global.get('load_error') !== true) {
    // global.set('load_error', true);
    // node.warn(`Error loading modules ${fail.join(', ')}`);
    lib.load_errors = fail;
  }
  lib.haFactory = lib.hautil.newHAFactory(global);
  return lib;
}
