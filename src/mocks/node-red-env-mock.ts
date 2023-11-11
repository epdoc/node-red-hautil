import { Dict } from 'epdoc-util';
import { EnvKey, NodeRedEnvObject } from '../types';

/**
 * A class to build a mock NodeRedOpts object for testing.
 */
export class NodeRedEnvMock implements NodeRedEnvObject {
  private db: Dict = {};

  constructor() {}

  get(key: EnvKey): any {
    return this.db[key];
  }
  setDb(val: Dict): this {
    this.db = val;
    return this;
  }
}
