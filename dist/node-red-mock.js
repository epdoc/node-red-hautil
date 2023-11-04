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
                    states: {}
                }
            },
            node: {}
        };
        this.init();
    }
    init() {
        this.opts = {
            env: {
                get: (key) => {
                    return this.db.env[key];
                }
            },
            flow: {
                get: (key) => {
                    return this.db.flow[key];
                },
                set: (key, val) => {
                    this.db.flow[key] = val;
                }
            },
            global: {
                get: (key) => {
                    return this.db.global[key];
                },
                set: (key, val) => {
                    this.db.global[key] = val;
                }
            },
            node: {
                warn: (...args) => { },
                debug: (...args) => { },
                error: (...args) => { },
                log: (...args) => { },
                send: (...args) => { },
                done: () => { }
            }
        };
    }
    setStates(states) {
        this.db.global.homeassistant.states = states;
        return this;
    }
    getEntity(entityId) {
        return this.db.global.homeassistant.states[entityId];
    }
    setEntity(entityId, val) {
        this.db.global.homeassistant.states[entityId] = val;
        return this;
    }
    setState(entityId, state) {
        this.db.global.homeassistant.states[entityId] = { state: state };
        return this;
    }
    getState(entityId) {
        const entity = this.getEntity(entityId);
        return entity ? entity.state : undefined;
    }
    setEnv(key, value) {
        this.opts.env[key] = value;
        return this;
    }
    setFlow(key, value) {
        this.opts.flow[key] = value;
        return this;
    }
    setGlobal(key, value) {
        this.opts.global[key] = value;
        return this;
    }
}
exports.NodeRedOptsMock = NodeRedOptsMock;
//# sourceMappingURL=node-red-mock.js.map