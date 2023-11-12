import { NodeRedGlobalApi } from '../types';
import { HA } from './ha';

export function newHAFactory(global: NodeRedGlobalApi): HAFactory {
  return new HAFactory(global);
}

export class HAFactory {
  protected _global: NodeRedGlobalApi;

  constructor(global: NodeRedGlobalApi) {
    this._global = global;
  }

  make() {
    return new HA(this._global);
  }
}
