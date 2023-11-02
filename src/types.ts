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
export function isNodeRedOpts(val: any): val is NodeRedOpts {
  return isDict(val) && val.node && val.flow && val.env;
}
