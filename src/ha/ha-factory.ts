import { NodeContextGlobalData } from '../types';
import { HA } from './ha';

export function newHAFactory(global: NodeContextGlobalData, server: string = 'homeAssistant'): HAFactory {
  return new HAFactory(global);
}

export class HAFactory {
  protected _global: NodeContextGlobalData;
  protected _server: string;

  constructor(global: NodeContextGlobalData, server: string = 'homeAssistant') {
    this._global = global;
    this._server = server;
  }

  make() {
    return new HA(this._global, this._server);
  }
}
