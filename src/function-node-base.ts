import { NodeContextFlowData, NodeContextGlobalData, NodeRedContextApi, NodeRedEnvApi, NodeRedNodeApi } from '.';

/**
 * Super class to use in our classes that support logging using node.warn and node.info.
 * For debug messages, only warn and error appear to be supported by Node-RED.
 */
export class FunctionNodeBase {
  protected env: NodeRedEnvApi;
  protected flow: NodeContextFlowData;
  protected global: NodeContextGlobalData;
  protected node: NodeRedNodeApi;

  constructor(global?: NodeContextGlobalData, opts?: NodeRedContextApi) {
    // @ts-ignore
    this.global = global
      ? global
      : {
          get: (key, type) => {},
          set: (key, data, type) => {}
        };
    // @ts-ignore
    this.flow = opts
      ? opts.flow
      : {
          get: (key, type) => {},
          set: (key, data, type) => {}
        };
    this.node = opts
      ? opts.node
      : {
          warn: (msg) => {},
          error: (msg) => {},
          debug: (msg) => {},
          trace: (msg) => {},
          log: (msg) => {},
          send: (...args) => {},
          done: () => {}
        };
    this.env = opts ? opts.env : { get: (key) => {} };
  }
}
