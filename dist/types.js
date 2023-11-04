"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeRedOpts = void 0;
const epdoc_util_1 = require("epdoc-util");
/**
 * Type guard. Tests if val is a valid NodeRedOpts object.
 * @param val
 * @returns
 */
function isNodeRedOpts(val) {
    return (0, epdoc_util_1.isDict)(val) && (0, epdoc_util_1.isDict)(val.node) && (0, epdoc_util_1.isDict)(val.flow) && (0, epdoc_util_1.isDict)(val.env) && (0, epdoc_util_1.isDict)(val.global);
}
exports.isNodeRedOpts = isNodeRedOpts;
//# sourceMappingURL=types.js.map