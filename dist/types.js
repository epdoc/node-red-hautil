"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeRedOpts = void 0;
const epdoc_util_1 = require("epdoc-util");
function isNodeRedOpts(val) {
    return (0, epdoc_util_1.isDict)(val) && val.node && val.flow && val.env;
}
exports.isNodeRedOpts = isNodeRedOpts;
//# sourceMappingURL=types.js.map