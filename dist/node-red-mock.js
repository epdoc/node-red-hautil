"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRedOptsMock = void 0;
/**
 * A class to build a mock NodeRedOpts object for testing.
 */
class NodeRedOptsMock {
    constructor() {
        this.db = {
            env: {},
            flow: {},
            global: {
                homeassistant: {
                    states: {},
                },
            },
            node: {},
        };
        this.init();
    }
    init() {
        this.opts = {
            env: {
                get: (key) => {
                    return this.db.env[key];
                },
            },
            flow: {
                get: (key) => {
                    return this.db.flow[key];
                },
                set: (key, val) => {
                    this.db.flow[key] = val;
                },
            },
            global: {
                get: (key) => {
                    return this.db.global[key];
                },
                set: (key, val) => {
                    this.db.global[key] = val;
                },
            },
            node: {
                warn: (...args) => this.db.node.warn(...args),
                debug: (...args) => this.db.node.warn(...args),
                error: (...args) => this.db.node.warn(...args),
                log: (...args) => this.db.node.warn(...args),
                send: (...args) => this.db.node.warn(...args),
                done: () => this.db.node.done(),
            },
        };
    }
    setStates(states) {
        this.db.global.homeassistant.states = states;
        return this;
    }
    setEnv(key, value) {
        this.db.env[key] = value;
        return this;
    }
    setFlow(key, value) {
        this.db.flow[key] = value;
        return this;
    }
    setGlobal(key, value) {
        this.db.global[key] = value;
        return this;
    }
}
exports.NodeRedOptsMock = NodeRedOptsMock;
//# sourceMappingURL=node-red-mock.js.map