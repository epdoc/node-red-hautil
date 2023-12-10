import { isDict, isFunction, isObject } from 'epdoc-util';
import { NodeMessage } from 'node-red';

export type EntityId = string; // Example 'light.master_bedroom'
export type EntityShortId = string; // The EntityId without the domain prepended (eg. 'master_bedroom')
export type EntityDomain = string; // Example 'light'
export type EntityService = string; // Example 'turn_on' or 'turn_off' or 'toggle'
export type EntityShortService = string; // Example 'on' or 'off'

export type EnvKey = string;

export interface NodeContextDataMin {
  /**
   * Get a value from context
   * @param key
   * @param storeName - store name when multiple context stores are used
   */
  get(key: string, storeName?: string): unknown;
  /**
   * Set a value in context
   * @param key
   * @param value
   * @param cb - callback for async calls
   */
  set(key: string, value: unknown, cb?: (err: Error) => void): void;
}

export interface NodeContextData extends NodeContextDataMin {
  /**
   * Get a value from context
   * @param key
   * @param storeName - store name when multiple context stores are used
   */
  get(key: string, storeName?: string): unknown;
  /**
   * Get a value from context asynchronously
   */
  get(key: string, cb: (err: Error, value: unknown) => void): void;
  /**
   * Get multiple values from context
   * @param keys
   * @param storeName - store name when multiple context stores are used
   */
  get(keys: string[], storeName?: string): unknown[];
  /**
   * Get multiple values from context asynchronously
   */
  get(keys: string[], cb: (err: Error, value: unknown[]) => void): void;

  /**
   * Get a value from context asynchronously, when multiple context stores are used
   */
  get(key: string, storeName: string | undefined, cb: (err: Error, value: unknown) => void): void;
  /**
   * Get multiple values from context asynchronously, when multiple context stores are used
   */
  get(keys: string[], storeName: string | undefined, cb: (err: Error, value: unknown[]) => void): void;

  /**
   * Set a value in context
   * @param key
   * @param value
   * @param cb - callback for async calls
   */
  set(key: string, value: unknown, cb?: (err: Error) => void): void;
  /**
   * Set multiple values in context
   * @param keys
   * @param values
   * @param cb - callback for async calls
   */
  set(keys: string[], values: unknown[], cb?: (err: Error) => void): void;

  /**
   * Set a value in context, when multiple context stores are used
   * @param key
   * @param value
   * @param storeName
   * @param cb - callback for async calls
   */
  set(key: string, value: unknown, storeName: string | undefined, cb?: (err: Error) => void): void;
  /**
   * Set multiple values in context, when multiple context stores are used
   * @param keys
   * @param values
   * @param storeName
   * @param cb - callback for async calls
   */
  set(keys: string[], values: unknown[], storeName: string | undefined, cb?: (err: Error) => void): void;

  /**
   * Returns a list of all node-scoped context property keys
   * @param storeName - store name when multiple context stores are used
   */
  keys(storeName?: string): string[];
  /**
   * Returns a list of all node-scoped context property keys asynchronously
   */
  keys(cb: (err: Error, value: unknown[]) => void): void;
  /**
   * Returns a list of all node-scoped context property keys asynchronously, when multiple context stores are used
   */
  keys(storeName: string | undefined, cb: (err: Error, value: unknown[]) => void): void;
}
export interface NodeContextGlobalData extends NodeContextData {}
export interface NodeContextFlowData extends NodeContextData {}
export interface NodeContext extends NodeContextData {
  global: NodeContextData;
  flow: NodeContextData;
}
export function isNodeContextData(val: any): val is NodeContextData {
  return isObject(val) && isFunction(val.get) && isFunction(val.set) && isFunction(val.keys);
}
export function isNodeContext(val: any): val is NodeContext {
  return (
    isObject(val) &&
    isFunction(val.get) &&
    isFunction(val.set) &&
    isFunction(val.keys) &&
    isNodeContextData(val.global) &&
    isNodeContextData(val.flow)
  );
}

export type ContextKey = string;
export type ContextStorageType = 'file' | 'memory';
export type NodeRedContextGetFunction = (key: ContextKey, storeName?: ContextStorageType) => any | Promise<any>;
export type NodeRedContextSetFunction = (
  key: ContextKey,
  data: any,
  storeName?: ContextStorageType
) => void | Promise<void>;
export type NodeRedLogFunction = (...args: any) => void;
export type NodeSend = (msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>) => void;
export type NodeDone = (err?: Error) => void;

export interface NodeRedEnvApi {
  get: (key: EnvKey) => any;
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
  send: NodeSend;
  done: NodeDone;
}
export function isNodeRedNodeApi(val: any): val is NodeRedNodeApi {
  return val && val.send && val.done && val.warn;
}

/**
 * Node-RED environment information that depends on context (not global)
 */
export type NodeRedContextApi = {
  env: NodeRedEnvApi;
  flow: NodeContextFlowData;
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
