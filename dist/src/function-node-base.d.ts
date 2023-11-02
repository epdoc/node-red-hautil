import { NodeRedEnvObject, NodeRedFlowObject, NodeRedGlobalObject, NodeRedNodeObject, NodeRedOpts } from '.';
/**
 * Super class to use in our classes that support logging using node.warn and node.info.
 */
export declare class FunctionNodeBase {
    protected env: NodeRedEnvObject;
    protected flow: NodeRedFlowObject;
    protected global: NodeRedGlobalObject;
    protected node: NodeRedNodeObject;
    constructor(opts?: NodeRedOpts);
    warn(...args: any[]): void;
}
