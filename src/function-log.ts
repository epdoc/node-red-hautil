import { isDict, isFunction } from 'epdoc-util';

export type LogFunction = (...args) => void;
export function isLogFunction(val: any): val is LogFunction {
  return isFunction(val);
}
// Functions that correspond to node.warn and node.info
export type LogOpts = {
  warn: LogFunction;
  info: LogFunction;
};

/**
 * Super class to use in our classes that support logging using node.warn and node.info.
 */
export class FunctionLog {
  public info: LogFunction = () => {};
  public warn: LogFunction = () => {};

  constructor(opts?: LogOpts) {
    this.initLog(opts);
  }

  protected initLog(opts?: LogOpts) {
    if (isDict(opts)) {
      this.warn = isLogFunction(opts.warn) ? opts.warn : this.warn;
      this.info = isLogFunction(opts.info) ? opts.info : this.info;
    }
    return this;
  }
}
