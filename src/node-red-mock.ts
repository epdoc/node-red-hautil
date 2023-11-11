import { Dict } from 'epdoc-util';
import { NodeRedGlobalMock } from './node-red-global-mock';
import { ContextKey, EntityId, EnvKey, NodeRedOpts } from './types';

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
    global: NodeRedGlobalMock,
    global2: {
      homeassistant: {
        homeAssistant: {
          states: {}
        }
      }
    },
    node: {}
  };

  constructor() {
    const g: NodeRedGlobalMock = new NodeRedGlobalMock();
    this.opts = {
      env: {
        get: (key: EnvKey) => {
          return this.db.env[key];
        }
      },
      flow: {
        get: (key: ContextKey) => {
          return this.db.flow[key];
        },
        set: (key: ContextKey, val: any) => {
          this.db.flow[key] = val;
        }
      },
      global: g,
      // global2: {
      //   get: (key: ContextKey) => {
      //     return this.db.global[key];
      //   },
      //   set: (key: ContextKey, val: any) => {
      //     this.db.global[key] = val;
      //   }
      // },
      node: {
        error: (...args: any) => {},
        warn: (...args: any) => {},
        debug: (...args: any) => {},
        trace: (...args: any) => {},
        log: (...args: any) => {},
        send: (...args: any) => {},
        done: () => {}
      }
    };
    this.db.global = g;
  }

  setStates(states: Dict): this {
    this.db.global.homeassistant.homeAssistant.states = states;
    return this;
  }

  getEntity(entityId: EntityId): Dict {
    return this.db.global.homeassistant.homeAssistant.states[entityId];
  }

  setEntity(entityId: EntityId, val: any): this {
    this.db.global.homeassistant.homeAssistant.states[entityId] = val;
    return this;
  }

  setState(entityId: EntityId, state: any): this {
    this.db.global.homeassistant.homeAssistant.states[entityId] = { state: state };
    return this;
  }

  getState(entityId: EntityId): any {
    const entity = this.getEntity(entityId);
    return entity ? entity.state : undefined;
  }

  setEnv(key: EnvKey, value: any): this {
    // @ts-ignore
    this.opts.env[key] = value;
    return this;
  }
  setFlow(key: ContextKey, value: any): this {
    // @ts-ignore
    this.opts.flow[key] = value;
    return this;
  }
  setGlobal(key: ContextKey, value: any): this {
    // @ts-ignore
    this.opts.global[key] = value;
    return this;
  }
}
