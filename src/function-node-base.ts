import { NodeRedEnvObject, NodeRedFlowObject, NodeRedGlobalObject, NodeRedNodeObject, NodeRedOpts } from '.';

/**
 * Super class to use in our classes that support logging using node.warn and node.info.
 * For debug messages, only warn and error appear to be supported by Node-RED.
 */
export class FunctionNodeBase {
  protected env: NodeRedEnvObject;
  protected flow: NodeRedFlowObject;
  protected global: NodeRedGlobalObject;
  protected node: NodeRedNodeObject;

  constructor(opts?: NodeRedOpts) {
    this.env = opts ? opts.env : { get: (key) => {} };
    this.flow = opts
      ? opts.flow
      : {
          get: (key, type) => {},
          set: (key, data, type) => {}
        };
    this.global = opts
      ? opts.global
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
  }

  public warn(...args: any[]) {
    return this.node.warn(...args);
  }
}
