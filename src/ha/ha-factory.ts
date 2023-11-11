import { NodeRedGlobalApi } from '../types';
import { HA } from './ha';

export function newHAFactory(global: NodeRedGlobalApi): HAFactory {
  return new HAFactory(global);
}

export class HAFactory {
  private _global: NodeRedGlobalApi;

  constructor(global: NodeRedGlobalApi) {
    this._global = global;
  }

  newHA() {
    return new HA(this._global);
  }
}
