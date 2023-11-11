import { Dict } from 'epdoc-util';
import { EntityId, NodeRedGlobalApi } from '../types';
import { NodeRedContextMock } from './node-red-context-mock';

/**
 * A class to build a mock NodeRedOpts object for testing.
 */
export class NodeRedGlobalMock extends NodeRedContextMock implements NodeRedGlobalApi {
  constructor() {
    super();
    this.db = {
      homeassistant: {
        homeAssistant: {
          states: {}
        }
      }
    };
  }

  get homeassistant(): any {
    return this.db.homeassistant;
  }

  setStates(states: Dict): this {
    this.db.homeassistant.homeAssistant.states = states;
    return this;
  }

  getEntity(entityId: EntityId): Dict {
    return this.db.homeassistant.homeAssistant.states[entityId];
  }

  // setEntity(entityId: EntityId, val: any): this {
  //   this.db.homeassistant.homeAssistant.states[entityId] = val;
  //   return this;
  // }

  // setState(entityId: EntityId, state: any): this {
  //   this.db.homeassistant.homeAssistant.states[entityId] = { state: state };
  //   return this;
  // }

  getState(entityId: EntityId): any {
    const entity = this.getEntity(entityId);
    return entity ? entity.state : undefined;
  }

  // setGlobal(key: ContextKey, value: any): this {
  //   // @ts-ignore
  //   this._global[key] = value;
  //   return this;
  // }
}
