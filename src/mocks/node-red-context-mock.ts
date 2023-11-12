import { Dict } from 'epdoc-util';
import { ContextKey, ContextStorageType } from '../types';

/**
 * A class to build a mock Node-RED context object for testing.
 */
export class NodeRedContextMock {
  public db: Dict = {};

  constructor() {}

  get(key: ContextKey, type: ContextStorageType = 'memory'): any {
    return this.db[key];
  }
  set(key: ContextKey, val: any, type: ContextStorageType = 'memory'): void {
    this.db[key] = val;
  }
}
