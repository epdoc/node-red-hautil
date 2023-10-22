"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoverService = void 0;
exports.newCoverService = newCoverService;
var _service = require("./service");
function newCoverService(name, options) {
  return new CoverService(name, options);
}

/**
 * Payload builder for service call
 */
class CoverService extends _service.Service {
  _domain = 'cover';

  /**
   * Shortcut to set service to close_cover.
   * @returns
   */
  close() {
    this._payload.service = 'close_cover';
    return this;
  }

  /**
   * Shortcut to set service to open_cover.
   * @returns
   */
  open() {
    this._payload.service = 'open_cover';
    return this;
  }
  stop() {
    this._payload.service = 'stop_cover';
    return this;
  }
}
exports.CoverService = CoverService;