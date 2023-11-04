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
export type NodeRedContextGetFunction = (key: ContextKey, type?: ContextStorageType) => any | Promise<any>;
export type NodeRedContextSetFunction = (key: ContextKey, data: any, type?: ContextStorageType) => void | Promise<void>;
export type NodeRedLogFunction = (...args: any) => void;
export type NodeRedSendFunction = (msg: NodeRedMessage | NodeRedMessage[]) => void | Promise<void>;
export type NodeRedDoneFunction = () => void;
export type NodeRedEnvObject = {
    get: (key: EnvKey) => any;
};
export type NodeRedFlowObject = {
    get: NodeRedContextGetFunction;
    set: NodeRedContextSetFunction;
};
export type NodeRedGlobalObject = {
    get: NodeRedContextGetFunction;
    set: NodeRedContextSetFunction;
};
export type NodeRedNodeObject = {
    warn: NodeRedLogFunction;
    error: NodeRedLogFunction;
    debug: NodeRedLogFunction;
    log: NodeRedLogFunction;
    send: NodeRedSendFunction;
    done: () => void;
};
/**
 * Node-RED environment information.
 */
export type NodeRedOpts = {
    env: NodeRedEnvObject;
    flow: NodeRedFlowObject;
    global: NodeRedGlobalObject;
    node: NodeRedNodeObject;
};
/**
 * Type guard. Tests if val is a valid NodeRedOpts object.
 * @param val
 * @returns
 */
export declare function isNodeRedOpts(val: any): val is NodeRedOpts;
