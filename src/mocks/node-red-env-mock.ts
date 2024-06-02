import { Dict } from '@epdoc/typeutil';
import { EnvKey, NodeRedEnvApi } from '../types';

/**
 * A class to build a mock NodeRedOpts object for testing.
 */
export class NodeRedEnvMock implements NodeRedEnvApi {
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
