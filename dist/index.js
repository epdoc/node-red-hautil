var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/epdoc-util/dist/index.js
var require_dist = __commonJS((exports) => {
  var isBoolean = function(val) {
    return typeof val === "boolean";
  };
  var isString = function(val) {
    return typeof val === "string";
  };
  var isNumber = function(val) {
    return typeof val === "number" && !isNaN(val);
  };
  var isInteger = function(val) {
    return isNumber(val) && Number.isInteger(val);
  };
  var isPosInteger = function(val) {
    return isInteger(val) && val > 0;
  };
  var isPosNumber = function(val) {
    return typeof val === "number" && !isNaN(val) && val > 0;
  };
  var isNonEmptyString = function(val) {
    return typeof val === "string" && val.length > 0;
  };
  var isFunction = function(val) {
    return typeof val === "function";
  };
  var isDate = function(val) {
    return val instanceof Date;
  };
  var isValidDate = function(val) {
    return val instanceof Date && !isNaN(val.getTime());
  };
  var isArray = function(val) {
    return Array.isArray(val);
  };
  var isNonEmptyArray = function(val) {
    return Array.isArray(val) && val.length > 0;
  };
  var isRegExp = function(val) {
    return val instanceof RegExp;
  };
  var isNull = function(val) {
    return val === null ? true : false;
  };
  var isDefined = function(val) {
    return val !== undefined;
  };
  var isDict = function(val) {
    if (!isObject(val)) {
      return false;
    }
    return true;
  };
  var hasValue = function(val) {
    return val !== null && val !== undefined;
  };
  var isEmpty = function(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  var isError = function(val) {
    return val instanceof Error;
  };
  var isObject = function(val) {
    return val !== null && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date) && !(val instanceof RegExp);
  };
  var pick = function(obj, ...args) {
    const result = {};
    if (Array.isArray(args[0])) {
      args = args[0];
    }
    args.forEach((key) => {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      }
    });
    return result;
  };
  var omit = function(obj, ...args) {
    if (Array.isArray(args[0])) {
      args = args[0];
    }
    const keys = Object.keys(obj).filter((key) => args.indexOf(key) < 0);
    const newObj = {};
    keys.forEach((k) => {
      newObj[k] = obj[k];
    });
    return newObj;
  };
  var isTrue = function(val) {
    if (typeof val === "number") {
      return val > 0 ? true : false;
    } else if (typeof val === "string") {
      return val.length && !REGEX.isFalse.test(val) ? true : false;
    } else if (typeof val === "boolean") {
      return val;
    }
    return false;
  };
  var isFalse = function(val) {
    if (typeof val === "number") {
      return val === 0 ? true : false;
    } else if (typeof val === "string") {
      return val.length && !REGEX.isTrue.test(val) ? true : false;
    } else if (typeof val === "boolean") {
      return val;
    }
    return false;
  };
  var asFloat = function(val, opts) {
    if (typeof val === "number") {
      return val;
    }
    let v;
    if (isNonEmptyString(val)) {
      let s;
      if (opts && opts.commaAsDecimal) {
        s = val.replace(/(\d)\.(\d)/g, "$1$2").replace(/(\d),/g, "$1.");
      } else {
        s = val.replace(/(\d),(\d)/g, "$1$2");
      }
      v = parseFloat(s);
    } else {
      v = NaN;
    }
    if (isNaN(v)) {
      if (opts && isNumber(opts.def)) {
        return opts.def;
      }
      return 0;
    }
    return v;
  };
  var asInt = function(val) {
    if (isNumber(val)) {
      return Number.isInteger(val) ? val : Math.round(val);
    } else if (isNonEmptyString(val)) {
      let v = parseFloat(val);
      if (isNumber(v)) {
        return Number.isInteger(v) ? v : Math.round(v);
      }
    }
    return 0;
  };
  var asRegExp = function(val) {
    if (isRegExp(val)) {
      return val;
    } else if (isDict(val) && isString(val.pattern)) {
      const keys = Object.keys(val);
      if (isString(val.flags) && keys.length === 2) {
        return new RegExp(val.pattern, val.flags);
      } else if (keys.length === 1) {
        return new RegExp(val.pattern);
      }
    }
  };
  var pad = function(n, width, z = "0") {
    const sn = String(n);
    return sn.length >= width ? sn : new Array(width - sn.length + 1).join(z) + sn;
  };
  var roundNumber = function(num, dec = 3) {
    const factor = Math.pow(10, dec);
    return Math.round(num * factor) / factor;
  };
  var deepCopy = function(a, opts) {
    if (a === undefined || a === null) {
      return a;
    } else if (typeof a === "number") {
      return a;
    } else if (typeof a === "string") {
      if (opts && opts.replace) {
        let r = a;
        Object.keys(opts.replace).forEach((b) => {
          const m = "{" + b + "}";
          if (r.includes(m)) {
            r = r.replace(m, opts.replace[b]);
          }
        });
        return r;
      } else {
        return a;
      }
    } else if (a instanceof Date || a instanceof RegExp) {
      return a;
    } else if (Array.isArray(a)) {
      const result = [];
      for (const b of a) {
        let r = deepCopy(b, opts);
        result.push(r);
      }
      return result;
    } else if (isObject(a)) {
      const re = opts && opts.detectRegExp ? asRegExp(a) : undefined;
      if (re) {
        return re;
      } else {
        const result2 = {};
        Object.keys(a).forEach((key) => {
          result2[key] = deepCopy(a[key], opts);
        });
        return result2;
      }
    }
    return a;
  };
  var deepEquals = function(a, b) {
    const aSet = _isSet(a);
    const bSet = _isSet(b);
    if (!aSet && !bSet) {
      return true;
    }
    if (!aSet || !bSet) {
      return false;
    }
    if (a === b || a.valueOf() === b.valueOf()) {
      return true;
    }
    if (Array.isArray(a) && a.length !== b.length) {
      return false;
    }
    if (a instanceof Date) {
      return false;
    }
    if (!(a instanceof Object)) {
      return false;
    }
    if (!(b instanceof Object)) {
      return false;
    }
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (kb.length === ka.length) {
      return ka.every((k) => {
        return deepEquals(a[k], b[k]);
      });
    }
    return false;
  };
  var compareDictValue = function(a, b, key) {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };
  var _isSet = function(a) {
    if (a === null || a === undefined) {
      return false;
    }
    if (Array.isArray(a) && !a.length) {
      return false;
    }
    if (a instanceof Date) {
      return true;
    }
    if (a instanceof Object && !Object.keys(a).length) {
      return false;
    }
    return true;
  };
  var asError = function(...args) {
    let err;
    const msg = [];
    if (args.length) {
      args.forEach((arg) => {
        if (arg instanceof Error) {
          if (!err) {
            err = arg;
          }
          msg.push(err.message);
        } else if (isString(arg)) {
          msg.push(arg);
        } else {
          msg.push(String(arg));
        }
      });
      if (!err) {
        err = new Error(msg.join(" "));
      } else {
        err.message = msg.join(" ");
      }
    }
    return err;
  };
  var delayPromise = function(ms) {
    return new Promise((resolve) => {
      setTimeout(function() {
        resolve();
      }, ms);
    });
  };
  var isClass = function(obj, name) {
    return isObject(obj) && obj.constructor.name === name;
  };
  var camelToDash = function(str) {
    return str.replace(REGEX.firstUppercase, ([first]) => first.toLowerCase()).replace(REGEX.allUppercase, ([letter]) => `-${letter.toLowerCase()}`);
  };
  var underscoreCapitalize = function(str) {
    return str.replace(REGEX.firstCapitalize, function($1) {
      return $1.toUpperCase();
    }).replace(REGEX.allCapitalize, function($1) {
      return $1.toUpperCase().replace("_", " ");
    });
  };
  var isType = function(val, ...types) {
    let util2 = new Util(val);
    return util2.isType(...types);
  };
  var util = function() {
    return new Util;
  };
  var utilObj = function(val, opts) {
    return new Util(val, opts);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Util = exports.utilObj = exports.util = exports.isType = exports.underscoreCapitalize = exports.camelToDash = exports.isClass = exports.delayPromise = exports.asError = exports.compareDictValue = exports.deepEquals = exports.deepCopy = exports.roundNumber = exports.pad = exports.asRegExp = exports.asInt = exports.asFloat = exports.isFalse = exports.isTrue = exports.omit = exports.pick = exports.isObject = exports.isError = exports.isEmpty = exports.hasValue = exports.isDict = exports.isDefined = exports.isNull = exports.isRegExp = exports.isNonEmptyArray = exports.isArray = exports.isValidDate = exports.isDate = exports.isFunction = exports.isNonEmptyString = exports.isPosNumber = exports.isPosInteger = exports.isInteger = exports.isNumber = exports.isString = exports.isBoolean = undefined;
  var REGEX = {
    isTrue: new RegExp(/^true$/, "i"),
    isFalse: new RegExp(/^false$/, "i"),
    customElement: new RegExp(/CustomElement$/),
    firstUppercase: new RegExp(/(^[A-Z])/),
    allUppercase: new RegExp(/([A-Z])/, "g"),
    firstCapitalize: new RegExp(/^([a-z])/),
    allCapitalize: new RegExp(/(\_[a-z])/, "gi"),
    tr: new RegExp(/^\[tr\](.+)$/),
    html: new RegExp(/[&<>"'\/]/, "g"),
    instr: new RegExp(/^\[([^\]]+)\](.*)$/),
    typeSplit: new RegExp(/\s*[,\|]{1}\s*/)
  };
  exports.isBoolean = isBoolean;
  exports.isString = isString;
  exports.isNumber = isNumber;
  exports.isInteger = isInteger;
  exports.isPosInteger = isPosInteger;
  exports.isPosNumber = isPosNumber;
  exports.isNonEmptyString = isNonEmptyString;
  exports.isFunction = isFunction;
  exports.isDate = isDate;
  exports.isValidDate = isValidDate;
  exports.isArray = isArray;
  exports.isNonEmptyArray = isNonEmptyArray;
  exports.isRegExp = isRegExp;
  exports.isNull = isNull;
  exports.isDefined = isDefined;
  exports.isDict = isDict;
  exports.hasValue = hasValue;
  exports.isEmpty = isEmpty;
  exports.isError = isError;
  exports.isObject = isObject;
  exports.pick = pick;
  exports.omit = omit;
  exports.isTrue = isTrue;
  exports.isFalse = isFalse;
  exports.asFloat = asFloat;
  exports.asInt = asInt;
  exports.asRegExp = asRegExp;
  exports.pad = pad;
  exports.roundNumber = roundNumber;
  exports.deepCopy = deepCopy;
  exports.deepEquals = deepEquals;
  exports.compareDictValue = compareDictValue;
  exports.asError = asError;
  exports.delayPromise = delayPromise;
  exports.isClass = isClass;
  exports.camelToDash = camelToDash;
  exports.underscoreCapitalize = underscoreCapitalize;
  exports.isType = isType;
  exports.util = util;
  exports.utilObj = utilObj;

  class Util {
    constructor(val, opts = {}) {
      this._path = [];
      this._throw = false;
      this._val = val;
      this._throw = opts.throw === true ? true : false;
      this._src = opts.src;
    }
    reset() {
      this._path = [];
      return this;
    }
    prop(...path) {
      return this.property(...path);
    }
    property(...path) {
      this._path = this._path.concat(this._resolvePath(...path));
      return this;
    }
    source() {
      if (!this._src) {
        return "object";
      }
      if (isString(this._src)) {
        return this._src;
      }
      return this._src.toString();
    }
    throw(v) {
      this._throw = v === true ? true : false;
      return this;
    }
    val() {
      return this.value();
    }
    value() {
      let val = this._val;
      if (this._path.length) {
        for (let i = 0, n = this._path.length;i < n; ++i) {
          const k = this._path[i];
          if (val && (k in val)) {
            val = val[k];
          } else {
            if (this._throw) {
              throw new Error(`Property ${this._path.join(".")} not found in ${this.source()}`);
            }
            return;
          }
        }
      }
      return val;
    }
    _resolvePath(...path) {
      let a = [];
      path.forEach((arg) => {
        if (isString(arg)) {
          arg = arg.replace(/\[(\w+)\]/g, ".$1");
          arg = arg.replace(/^\./, "");
          const args = arg.split(".");
          a = [...a, ...args];
        } else if (isArray(arg)) {
          a = [...a, ...arg];
        }
      });
      return a;
    }
    setVal(value) {
      this.setValue(this._val, value);
      return this;
    }
    setValue(object, value) {
      let a = [];
      if (this._path && this._path.length && isDict(object)) {
        let obj = object;
        const n = this._path.length;
        for (let i = 0;i < n; ++i) {
          const k = this._path[i];
          if (obj) {
            if (i >= n - 1) {
              if (isDict(obj)) {
                obj[k] = value;
              }
            } else {
              if (!(k in obj)) {
                obj[k] = {};
              }
              obj = obj[k];
            }
          }
        }
      }
      return this;
    }
    asBoolean() {
      return isTrue(this.value());
    }
    asInt() {
      return asInt(this.value());
    }
    asFloat() {
      return asFloat(this.value());
    }
    asString() {
      return String(this.value());
    }
    isDict() {
      return isDict(this.value());
    }
    isBoolean() {
      return isBoolean(this.value());
    }
    isString() {
      return isString(this.value());
    }
    isNumber() {
      return isNumber(this.value());
    }
    isPosNumber() {
      return isPosNumber(this.value());
    }
    isInteger() {
      return isInteger(this.value());
    }
    isNonEmptyString() {
      return isNonEmptyString(this.value());
    }
    isFunction() {
      return isFunction(this.value());
    }
    isDate() {
      return isDate(this.value());
    }
    isValidDate() {
      return isValidDate(this.value());
    }
    isArray() {
      return isArray(this.value());
    }
    isNonEmptyArray() {
      return isNonEmptyArray(this.value());
    }
    isRegExp() {
      return isRegExp(this.value());
    }
    isNull() {
      return isNull(this.value());
    }
    isDefined() {
      return isDefined(this.value());
    }
    hasValue() {
      return hasValue(this.value());
    }
    isEmpty() {
      return isEmpty(this.value());
    }
    isError() {
      return isError(this.value());
    }
    isObject() {
      return isObject(this.value());
    }
    isType(...types) {
      let v = this.value();
      let ts = [];
      for (const t of types) {
        if (isNonEmptyString(t)) {
          ts = [...ts, ...t.trim().split(REGEX.typeSplit)];
        } else if (isArray(t)) {
          for (const t1 of t) {
            if (isNonEmptyString(t1)) {
              ts = [...ts, ...t1.split(REGEX.typeSplit)];
            }
          }
        }
      }
      let ts2 = [];
      for (const t of ts) {
        if (isString(t)) {
          let s = t.trim();
          if (s.length) {
            ts2.push(s);
          }
        }
      }
      let errors = [];
      for (const t of ts2) {
        let fn = "is" + t.charAt(0).toUpperCase() + t.slice(1);
        if (isFunction(this[fn])) {
          if (this[fn](v)) {
            return true;
          }
        } else {
          errors.push(t);
        }
      }
      if (errors.length) {
        throw new Error(`Invalid type [${errors.join(",")}]`);
      }
      return false;
    }
  }
  exports.Util = Util;
});

// src/function-node-base.ts
class FunctionNodeBase {
  env;
  flow;
  global;
  node;
  constructor(opts) {
    this.env = opts ? opts.env : { get: (key) => {
    } };
    this.flow = opts ? opts.flow : {
      get: (key, type) => {
      },
      set: (key, data, type) => {
      }
    };
    this.global = opts ? opts.global : {
      get: (key, type) => {
      },
      set: (key, data, type) => {
      }
    };
    this.node = opts ? opts.node : {
      warn: (msg) => {
      },
      error: (msg) => {
      },
      debug: (msg) => {
      },
      log: (msg) => {
      },
      send: (...args) => {
      },
      done: () => {
      }
    };
  }
  warn(...args) {
    return this.node.warn(...args);
  }
}

// src/service.ts
function newService(entity_id, opts) {
  return new Service(entity_id, opts);
}

class Service extends FunctionNodeBase {
  _payload = { target: { entity_id: "" } };
  constructor(entity_id, opts) {
    super(opts);
    this.initPayload(entity_id);
  }
  initPayload(entity_id) {
    const domain = this._domain();
    this._payload.target = { entity_id };
    this._payload.domain = domain;
    const parts = entity_id.split(".");
    if (parts.length > 1) {
      this._payload.domain = parts[0];
    } else if (domain && parts.length < 2) {
      this._payload.target.entity_id = domain + "." + entity_id;
    }
    return this;
  }
  _domain() {
    return;
  }
  get entity_id() {
    return this._payload.target.entity_id;
  }
  domain(val) {
    this._payload.domain = val;
    if (!this._payload.target.entity_id.includes(".")) {
      this._payload.target.entity_id = val + "." + this._payload.target.entity_id;
    }
    return this;
  }
  service(val) {
    this._payload.service = val;
    return this;
  }
  payload() {
    return this._payload;
  }
  increment() {
    this._payload.service = "increment";
    return this;
  }
  decrement() {
    this._payload.service = "decrement";
    return this;
  }
  value(val) {
    this._payload.service = "set_value";
    this._payload.data = {
      value: val
    };
    return this;
  }
  date(val) {
    this._payload.service = "set_datetime";
    this._payload.data = {
      timestamp: Math.round(val.getTime() / 1000)
    };
    return this;
  }
}

// src/alarm-service.ts
function isAlarmServiceArmType(val) {
  return ARMTYPE.hasOwnProperty(val);
}
function newAlarmService(entity_id, opts) {
  return new AlarmService(entity_id, opts);
}
var ARMTYPE = {
  away: "alarm_arm_away",
  home: "alarm_arm_home",
  night: "alarm_arm_night",
  vacation: "alarm_arm_vacation",
  custom_bypass: "arm_arm_custom_bypass",
  trigger: "alarm_trigger"
};

class AlarmService extends Service {
  constructor() {
    super(...arguments);
  }
  _domain() {
    return "alarm_control_panel";
  }
  disarm() {
    this._payload.service = "alarm_disarm";
    return this;
  }
  arm(type) {
    if (isAlarmServiceArmType(type)) {
      this._payload.service = ARMTYPE[type];
    }
    return this;
  }
}
// src/cover-service.ts
function newCoverService(entity_id, opts) {
  return new CoverService(entity_id, opts);
}

class CoverService extends Service {
  constructor() {
    super(...arguments);
  }
  _domain() {
    return "cover";
  }
  close() {
    this._payload.service = "close_cover";
    return this;
  }
  open() {
    this._payload.service = "open_cover";
    return this;
  }
  stop() {
    this._payload.service = "stop_cover";
    return this;
  }
}
// src/entity-state.ts
class EntityState {
  _state;
  constructor(state) {
    this._state = state;
  }
  equals(val) {
    return this._state === val;
  }
  isOn() {
    return this.equals("on");
  }
  isOff() {
    return this.equals("off");
  }
  asNumber(defval) {
    return this._state ? parseFloat(this._state) : defval;
  }
  asInt(defval) {
    return this._state ? parseInt(this._state, 10) : defval;
  }
  asInteger(defval) {
    return this.asInt(defval);
  }
  toString() {
    return this._state;
  }
  value() {
    return this._state;
  }
}

// src/fan-speed6-service.ts
var import_epdoc_util = __toESM(require_dist(), 1);

// src/switch-service.ts
function newSwitchService(entity_id, opts) {
  return new SwitchService(entity_id, opts);
}

class SwitchService extends Service {
  constructor() {
    super(...arguments);
  }
  _domain() {
    return "switch";
  }
  on() {
    this._payload.service = "turn_on";
    return this;
  }
  off() {
    this._payload.service = "turn_off";
    return this;
  }
}

// src/light-service.ts
function newLightService(entity_id, opts) {
  return new LightService(entity_id, opts);
}

class LightService extends SwitchService {
  constructor() {
    super(...arguments);
  }
  _domain() {
    return "light";
  }
  percentage(val) {
    this._payload.service = "set_percentage";
    this._payload.data = {
      percentage: val
    };
    return this;
  }
}

// src/fan-service.ts
function newFanService(entity_id, opts) {
  return new FanService(entity_id, opts);
}

class FanService extends LightService {
  constructor() {
    super(...arguments);
  }
  _domain() {
    return "fan";
  }
}

// src/fan-speed6-service.ts
function isFanSpeed6Speed(val) {
  return import_epdoc_util.isInteger(val) && val >= 0 && val <= 6;
}
function newFanSpeed6Service(entity_id, opts) {
  return new FanSpeed6Service(entity_id, opts);
}
var FAN_PERCENTAGES = [0, 16, 33, 50, 66, 83, 100];
var FAN_LIMITS = [-1, 8, 25, 42, 58, 75, 92, 100];

class FanSpeed6Service extends FanService {
  constructor() {
    super(...arguments);
  }
  speed(val) {
    return this.percentage(FanSpeed6Service.speedToPercentage(val));
  }
  static speedToPercentage(speed) {
    let sp = speed;
    if (speed < 1 || speed >= FAN_PERCENTAGES.length) {
      sp = 2;
    }
    return FAN_PERCENTAGES[sp];
  }
  static percentageToSpeed(percentage) {
    for (let pdx = 0;pdx <= 6; ++pdx) {
      if (percentage > FAN_LIMITS[pdx] && percentage <= FAN_LIMITS[pdx + 1]) {
        return pdx;
      }
    }
    return 0;
  }
}

// src/entity.ts
class Entity {
  _entity;
  constructor(entity) {
    this._entity = entity;
  }
  state() {
    return new EntityState(this._entity ? this._entity.state : undefined);
  }
  exists() {
    return this._entity ? true : false;
  }
  isOn() {
    return this.state().isOn();
  }
  isOff() {
    return this.state().isOff();
  }
  asNumber(defval) {
    return this.state().asNumber(defval);
  }
  asInt(defval) {
    return this.state().asInt(defval);
  }
  asInteger(defval) {
    return this.asInt(defval);
  }
  speed(defval) {
    if (this._entity && this._entity.attributes && this._entity.attributes.percentage) {
      return FanSpeed6Service.percentageToSpeed(parseInt(this._entity.attributes.percentage, 10));
    }
    return defval;
  }
}
// src/ha.ts
function newHA(opts) {
  return new HA(opts);
}

class HA extends FunctionNodeBase {
  _ha;
  constructor(opts) {
    super(opts);
    this._ha = this.global.get("homeassistant");
  }
  get ha() {
    return this._ha;
  }
  entity(entity_id) {
    return new Entity(this._ha.states[entity_id]);
  }
  entityState(entity_id) {
    const entity2 = this.entity(entity_id);
    return entity2 ? entity2.state() : undefined;
  }
  retrieveSensorsData(sensorDict) {
    for (const name in sensorDict) {
      if (sensorDict.hasOwnProperty(name)) {
        let item = sensorDict[name];
        item.entity = this.entity(item.id);
        if (item.type === "boolean") {
          if (item.entity.isOn()) {
            item.on = true;
            item.off = false;
          } else if (item.entity.isOff()) {
            item.on = false;
            item.off = true;
          }
        } else if (item.type === "number") {
          item.val = item.entity.asNumber(item.defval);
        } else if (item.type === "int") {
          item.val = item.entity.asInt(item.defval);
        }
      }
    }
  }
}
// src/types.ts
var import_epdoc_util2 = __toESM(require_dist(), 1);
function isNodeRedOpts(val) {
  return import_epdoc_util2.isDict(val) && val.node && val.flow && val.env;
}
function createNodeRedOptsMock(data) {
  const opts = {
    env: {
      get: (key) => {
        return data.env[key];
      }
    },
    flow: {
      get: (key) => {
        return data.flow[key];
      },
      set: (key, val) => {
        data.flow[key] = val;
      }
    },
    global: {
      get: (key) => {
        return data.global[key];
      },
      set: (key, val) => {
        data.global[key] = val;
      }
    },
    node: {
      warn: (...args) => data.node.warn(...args),
      debug: (...args) => data.node.warn(...args),
      error: (...args) => data.node.warn(...args),
      log: (...args) => data.node.warn(...args),
      send: (...args) => data.node.warn(...args),
      done: () => data.node.done()
    }
  };
  return opts;
}
export {
  newSwitchService,
  newService,
  newLightService,
  newHA,
  newFanSpeed6Service,
  newFanService,
  newCoverService,
  newAlarmService,
  isNodeRedOpts,
  isFanSpeed6Speed,
  isAlarmServiceArmType,
  createNodeRedOptsMock,
  SwitchService,
  Service,
  LightService,
  HA,
  FunctionNodeBase,
  FanSpeed6Service,
  FanService,
  EntityState,
  Entity,
  CoverService,
  AlarmService
};
