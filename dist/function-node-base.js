"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionNodeBase = void 0;
/**
 * Super class to use in our classes that support logging using node.warn and node.info.
 */
class FunctionNodeBase {
    constructor(opts) {
        this.env = opts ? opts.env : { get: (key) => { } };
        this.flow = opts
            ? opts.flow
            : {
                get: (key, type) => { },
                set: (key, data, type) => { },
            };
        this.global = opts
            ? opts.global
            : {
                get: (key, type) => { },
                set: (key, data, type) => { },
            };
        this.node = opts
            ? opts.node
            : {
                warn: (msg) => { },
                error: (msg) => { },
                debug: (msg) => { },
                log: (msg) => { },
                send: (...args) => { },
                done: () => { },
            };
    }
    warn(...args) {
        return this.node.warn(...args);
    }
}
exports.FunctionNodeBase = FunctionNodeBase;
//# sourceMappingURL=function-node-base.js.map