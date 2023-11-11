import { NodeRedMessage, NodeRedNodeApi } from '../types';

export class NodeRedNodeMock implements NodeRedNodeApi {
  constructor() {}

  error(...args: any) {}

  warn(...args: any) {}

  debug(...args: any) {}

  trace(...args: any) {}

  log(...args: any) {}

  send(msg: NodeRedMessage | NodeRedMessage[]) {}

  done() {}
}
