import { Dict, Integer, isDict } from 'epdoc-util';

export type EntityId = string; // Example 'light.master_bedroom'
export type EntityShortId = string; // The EntityId without the domain prepended (eg. 'master_bedroom')
export type EntityDomain = string; // Example 'light'
export type EntityService = string; // Example 'turn_on' or 'turn_off' or 'toggle'
export type EntityShortService = string; // Example 'on' or 'off'
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
/**
 * For sidebar debug messages, only the `error` and `warn` methods will result
 * in output, regardless of the logging level set in `settings.js`.
 */
export type NodeRedNodeObject = {
  error: NodeRedLogFunction;
  warn: NodeRedLogFunction;
  debug: NodeRedLogFunction;
  trace: NodeRedLogFunction;
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
export function isNodeRedOpts(val: any): val is NodeRedOpts {
  return isDict(val) && isDict(val.node) && isDict(val.flow) && isDict(val.env) && isDict(val.global);
}
