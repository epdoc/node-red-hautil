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
export declare class NodeRedOptsMock {
    opts: NodeRedOpts;
    db: Dict;
    constructor();
    init(): void;
    setStates(states: Dict): this;
    setEnv(key: EnvKey, value: any): this;
    setFlow(key: ContextKey, value: any): this;
    setGlobal(key: ContextKey, value: any): this;
}
