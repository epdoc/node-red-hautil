import { Dict } from 'epdoc-util';
import { ContextKey } from '../types';

/**
 * A class to build a mock Node-RED context object for testing.
 */
export class NodeRedContextMock {
  protected db: Dict = {};

  constructor() {}

  get(key: ContextKey): any {
    return this.db[key];
  }
  set(key: ContextKey, val: any): void {
    this.db[key] = val;
  }
}
