import { Dict } from '@epdoc/typeutil';
import { ContextKey, ContextStorageType, NodeContextDataMin } from '../types';

/**
 * A class to build a mock Node-RED context object for testing.
 */
export class NodeRedContextMock implements NodeContextDataMin {
  public db: Dict = {};

  constructor() {}

  get(key: ContextKey, storeName?: ContextStorageType): unknown {
    return this.db[key];
  }

  set(key: ContextKey, val: unknown): void {
    this.db[key] = val;
  }
}
