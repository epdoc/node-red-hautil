"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  version: true
};
exports.version = version;
var _package = _interopRequireDefault(require("../package.json"));
var _alarmService = require("./alarm-service.js");
Object.keys(_alarmService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alarmService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alarmService[key];
    }
  });
});
var _coverService = require("./cover-service.js");
Object.keys(_coverService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _coverService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _coverService[key];
    }
  });
});
var _fanSpeed6Service = require("./fan-speed6-service.js");
Object.keys(_fanSpeed6Service).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _fanSpeed6Service[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fanSpeed6Service[key];
    }
  });
});
var _fan = require("./fan.js");
Object.keys(_fan).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _fan[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fan[key];
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
var _lightService = require("./light-service.js");
Object.keys(_lightService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _lightService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _lightService[key];
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
var _switchService = require("./switch-service.js");
Object.keys(_switchService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _switchService[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _switchService[key];
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