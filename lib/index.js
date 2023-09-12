"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  version: true
};
exports.version = version;
var _package = _interopRequireDefault(require("../package.json"));
var _service = require("./service.js");
Object.keys(_service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _service[key];
    }
  });
});
var _ha = require("./ha.js");
Object.keys(_ha).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ha[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ha[key];
    }
  });
});
var _locationHistory = require("./location-history.js");
Object.keys(_locationHistory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _locationHistory[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locationHistory[key];
    }
  });
});
var _util = require("./util.js");
Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _util[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _util[key];
    }
  });
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The module version number, to make sure Node-RED loaded the right version.
 * @returns Package version number
 */
function version() {
  return _package.default.version;
}