import { Dict } from '@epdoc/typeutil';
import { HAEntityData } from '../ha';
import { EntityId } from '../types';
import { NodeRedContextMock } from './node-red-context-mock';

/**
 * A class to build a mock NodeRedOpts object for testing.
 */
// @ts-ignore
export class NodeRedGlobalMock extends NodeRedContextMock {
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

  get states(): Dict {
    return this.db.homeassistant.homeAssistant.states;
  }

  setStates(states: Dict): this {
    Object.keys(states).forEach((entityId) => {
      this.setEntity(entityId, states[entityId]);
    });
    return this;
  }

  getEntity(entityId: EntityId): Dict {
    return this.states[entityId];
  }

  setEntity(entityId: EntityId, val: HAEntityData | Dict): this {
    if (!val.entity_id) {
      val.entity_id = entityId;
    }
    if (!val.attributes) {
      val.attributes = { friendly_name: entityId.replace('.', ' ').replace('_', ' ') };
    }
    if (!val.attributes.friendly_name) {
      val.attributes.friendly_name = entityId.replace('.', ' ').replace('_', ' ');
    }
    this.states[entityId] = val;
    // console.log(`Set ${entityId} to ${JSON.stringify(val)}`);
    return this;
  }

  setEntityStateValue(entityId: EntityId, state: any): this {
    if (!this.states[entityId]) {
      this.setEntity(entityId, { state: state });
    } else {
      this.states[entityId].state = state;
    }
    return this;
  }

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
