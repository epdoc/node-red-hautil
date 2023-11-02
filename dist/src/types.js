import { isDict } from 'epdoc-util';
export function isNodeRedOpts(val) {
    return isDict(val) && val.node && val.flow && val.env;
}
/**
 * Function for mock NodeRedOpts
 * @param data
 */
export function createNodeRedOptsMock(data) {
    const opts = {
        env: {
            get: (key) => {
                return data.env[key];
            },
        },
        flow: {
            get: (key) => {
                return data.flow[key];
            },
            set: (key, val) => {
                data.flow[key] = val;
            },
        },
        global: {
            get: (key) => {
                return data.global[key];
            },
            set: (key, val) => {
                data.global[key] = val;
            },
        },
        node: {
            warn: (...args) => data.node.warn(...args),
            debug: (...args) => data.node.warn(...args),
            error: (...args) => data.node.warn(...args),
            log: (...args) => data.node.warn(...args),
            send: (...args) => data.node.warn(...args),
            done: () => data.node.done(),
        },
    };
    return opts;
}
//# sourceMappingURL=types.js.map