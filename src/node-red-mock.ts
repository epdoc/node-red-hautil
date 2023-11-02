import { Dict } from 'epdoc-util';
import { ContextKey, EnvKey, NodeRedOpts } from './types';

export type NodeRedOptsMockData = {
  env: Dict;
  flow: Dict;
  global: Dict;
  node: Dict;
};

/**
 * A class to build a mock NodeRedOpts object for testing.
 */
export class NodeRedOptsMock {
  opts: NodeRedOpts;
  db: Dict = {
    env: {},
    flow: {},
    global: {
      homeassistant: {
        states: {},
      },
    },
    node: {},
  };

  constructor() {
    this.init();
  }

  init() {
    this.opts = {
      env: {
        get: (key: EnvKey) => {
          return this.db.env[key];
        },
      },
      flow: {
        get: (key: ContextKey) => {
          return this.db.flow[key];
        },
        set: (key: ContextKey, val: any) => {
          this.db.flow[key] = val;
        },
      },
      global: {
        get: (key: ContextKey) => {
          return this.db.global[key];
        },
        set: (key: ContextKey, val: any) => {
          this.db.global[key] = val;
        },
      },
      node: {
        warn: (...args: any) => this.db.node.warn(...args),
        debug: (...args: any) => this.db.node.warn(...args),
        error: (...args: any) => this.db.node.warn(...args),
        log: (...args: any) => this.db.node.warn(...args),
        send: (...args: any) => this.db.node.warn(...args),
        done: () => this.db.node.done(),
      },
    };
  }

  setStates(states: Dict): this {
    this.db.global.homeassistant.states = states;
    return this;
  }

  setEnv(key: EnvKey, value: any): this {
    this.db.env[key] = value;
    return this;
  }
  setFlow(key: ContextKey, value: any): this {
    this.db.flow[key] = value;
    return this;
  }
  setGlobal(key: ContextKey, value: any): this {
    this.db.global[key] = value;
    return this;
  }
}
