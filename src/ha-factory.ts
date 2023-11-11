import { HA } from './ha';
import { NodeRedGlobalObject } from './types';

export class HAFactory {
  private _global: NodeRedGlobalObject;

  constructor(global: NodeRedGlobalObject) {
    this._global = global;
  }

  newHA() {
    return new HA(this._global);
  }
}
