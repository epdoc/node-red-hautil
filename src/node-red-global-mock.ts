import { Dict } from 'epdoc-util';
import { ContextKey, EntityId } from './types';

/**
 * A class to build a mock NodeRedOpts object for testing.
 */
export class NodeRedGlobalMock {
  private db: Dict = {
    homeassistant: {
      homeAssistant: {
        states: {}
      }
    }
  };

  constructor() {}

  get(key: ContextKey): any {
    return this.db[key];
  }
  set(key: ContextKey, val: any): void {
    this.db[key] = val;
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

  setEntity(entityId: EntityId, val: any): this {
    this.db.homeassistant.homeAssistant.states[entityId] = val;
    return this;
  }

  setState(entityId: EntityId, state: any): this {
    this.db.homeassistant.homeAssistant.states[entityId] = { state: state };
    return this;
  }

  getState(entityId: EntityId): any {
    const entity = this.getEntity(entityId);
    return entity ? entity.state : undefined;
  }

  setGlobal(key: ContextKey, value: any): this {
    // @ts-ignore
    this._global[key] = value;
    return this;
  }
}
