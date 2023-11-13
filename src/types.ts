import { isDict } from 'epdoc-util';
import { NodeMessage } from 'node-red';

export type EntityId = string; // Example 'light.master_bedroom'
export type EntityShortId = string; // The EntityId without the domain prepended (eg. 'master_bedroom')
export type EntityDomain = string; // Example 'light'
export type EntityService = string; // Example 'turn_on' or 'turn_off' or 'toggle'
export type EntityShortService = string; // Example 'on' or 'off'

export type EnvKey = string;
export type ContextKey = string;
export type ContextStorageType = 'file' | 'memory';
export type NodeRedContextGetFunction = (key: ContextKey, storeName?: ContextStorageType) => any | Promise<any>;
export type NodeRedContextSetFunction = (
  key: ContextKey,
  data: any,
  storeName?: ContextStorageType
) => void | Promise<void>;
export type NodeRedLogFunction = (...args: any) => void;
export type NodeRedSendFunction = (msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>) => void;
export type NodeRedDoneFunction = (err?: Error) => void;

export interface NodeRedEnvApi {
  get: (key: EnvKey) => any;
}
export interface NodeRedFlowApi {
  get: NodeRedContextGetFunction;
  set: NodeRedContextSetFunction;
}
export interface NodeRedGlobalApi {
  get: NodeRedContextGetFunction;
  set: NodeRedContextSetFunction;
}
/**
 * For sidebar debug messages, only the `error` and `warn` methods will result
 * in output, regardless of the logging level set in `settings.js`.
 */
export interface NodeRedNodeApi {
  error: NodeRedLogFunction;
  warn: NodeRedLogFunction;
  debug: NodeRedLogFunction;
  trace: NodeRedLogFunction;
  log: NodeRedLogFunction;
  send: NodeRedSendFunction;
  done: () => void;
}
export function isNodeRedNodeApi(val: any): val is NodeRedNodeApi {
  return val && val.send && val.done && val.warn;
}

/**
 * Node-RED environment information that depends on context (not global)
 */
export type NodeRedContextApi = {
  env: NodeRedEnvApi;
  flow: NodeRedFlowApi;
  node: NodeRedNodeApi;
};
export function isNodeRedContextApi(val: any): val is NodeRedContextApi {
  return val && val.env && val.flow && val.node;
}
/**
 * Type guard. Tests if val is a valid NodeRedOpts object.
 * @param val
 * @returns
 */
export function isNodeRedOpts(val: any): val is NodeRedContextApi {
  return isDict(val) && isDict(val.node) && isDict(val.flow) && isDict(val.env);
}
