import { Dict, Integer } from 'epdoc-util';
export type EntityId = string;
export type EntityShortId = string;
export type EntityDomain = string;
export type EntityService = string;
export type EntityShortService = string;
export type Milliseconds = Integer;
export type EpochMilliseconds = Integer;
export type NodeRedMessage = Dict & {
    payload: any;
};
export type EnvKey = string;
export type ContextKey = string;
export type ContextStorageType = 'file' | 'memory';
export type NodeRedLogFunction = (...args: any) => void;
export type NodeRedSendFunction = (msg: NodeRedMessage | NodeRedMessage[]) => void | Promise<void>;
export type NodeRedDoneFunction = () => void;
export type NodeRedEnvObject = {
    get: (key: EnvKey) => any;
};
export type NodeRedFlowObject = {
    get: (key: ContextKey, type?: ContextStorageType) => any | Promise<any>;
    set: (key: ContextKey, data: any, type?: ContextStorageType) => void | Promise<void>;
};
export type NodeRedGlobalObject = {
    get: (key: ContextKey, type?: ContextStorageType) => any | Promise<any>;
    set: (key: ContextKey, data: any, type?: ContextStorageType) => void | Promise<void>;
};
export type NodeRedNodeObject = {
    warn: NodeRedLogFunction;
    error: NodeRedLogFunction;
    debug: NodeRedLogFunction;
    log: NodeRedLogFunction;
    send: NodeRedSendFunction;
    done: () => void;
};
export type NodeRedOpts = {
    env: NodeRedEnvObject;
    flow: NodeRedFlowObject;
    global: NodeRedGlobalObject;
    node: NodeRedNodeObject;
};
export declare function isNodeRedOpts(val: any): val is NodeRedOpts;
export type NodeRedOptsMockData = {
    env: Dict;
    flow: Dict;
    global: Dict;
    node: Dict;
};
/**
 * Function for mock NodeRedOpts
 * @param data
 */
export declare function createNodeRedOptsMock(data: NodeRedOptsMockData): NodeRedOpts;
