/**
 * Super class to use in our classes that support logging using node.warn and node.info.
 */
export class FunctionNodeBase {
    env;
    flow;
    global;
    node;
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
//# sourceMappingURL=function-node-base.js.map