"use strict";

const REGEX = {
  isTrue: /^true$/i,
  isFalse: /^false$/i,
  firstUppercase: /(^[A-Z])/,
  allUppercase: /([A-Z])/g,
  tr: /^\[tr\](.+)$/,
  html: /[&<>"'\/]/g,
  typeSplit: /\s*[,\|]{1}\s*/,
};

function isBoolean(val) {
  return typeof val === 'boolean';
}

function isString(val) {
  return typeof val === 'string';
}

function isNumber(val) {
  return typeof val === 'number' && !isNaN(val);
}

function isInteger(val) {
  return isNumber(val) && Number.isInteger(val);
}

function isPosNumber(val) {
  return typeof val === 'number' && !isNaN(val) && val > 0;
}

function isNonEmptyString(val) {
  return typeof val === 'string' && val.length > 0;
}

function isFunction(val) {
  return typeof val === 'function';
}

function isDate(val) {
  return val instanceof Date;
}

function isArray(val) {
  return Array.isArray(val);
}

function isNonEmptyArray(val) {
  return Array.isArray(val) && val.length > 0;
}

function isRegExp(val) {
  return val instanceof RegExp;
}

function isNull(val) {
  return val === null ? true : false;
}

function isDefined(val) {
  return val !== undefined;
}
function isDict(val) {
  if (!isObject(val)) {
    return false;
  }
  return true;
}

/**
 * Is not undefined or null.
 * @param val - The value to be tested
 */
function hasValue(val) {
  return val !== null && val !== undefined;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function isError(val) {
  return val instanceof Error;
}

/**
 * An Object and NOT an array or Date
 * @param obj
 */
function isObject(val) {
  return (
    val !== null &&
    typeof val === 'object' &&
    !Array.isArray(val) &&
    !(val instanceof Date) &&
    !(val instanceof RegExp)
  );
}

// function schemaTypeValidator(type: string) {
//   return Util.VAL_MAP[type];
// }

function isTrue(val) {
  if (typeof val === 'number') {
    return val > 0 ? true : false;
  } else if (typeof val === 'string') {
    return val.length && !REGEX.isFalse.test(val) ? true : false;
  } else if (typeof val === 'boolean') {
    return val;
  }
  return false;
}

function isFalse(val) {
  if (typeof val === 'number') {
    return val === 0 ? true : false;
  } else if (typeof val === 'string') {
    return val.length && !REGEX.isTrue.test(val) ? true : false;
  } else if (typeof val === 'boolean') {
    return val;
  }
  return false;
}

/**
 * Return val as a float. Handles thousands separators (comma).
 * @param val
 * @param opts.def number
 * @param opts.commaAsDecimal boolean
 */
function asFloat(val, opts) {
  if (typeof val === 'number') {
    return val;
  }
  let v;
  if (isNonEmptyString(val)) {
    let s;
    if (opts && opts.commaAsDecimal) {
      s = val.replace(/(\d)\.(\d)/g, '$1$2').replace(/(\d),/g, '$1.');
    } else {
      s = val.replace(/(\d),(\d)/g, '$1$2');
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
}

/**
 * Always returns a valid integer. Returns 0 if the val cannot be parsed or rounded to an integer.
 * @param val
 */
function asInt(val) {
  // for speed do this test first
  if (isNumber(val)) {
    return Number.isInteger(val) ? val : Math.round(val);
  } else if (isNonEmptyString(val)) {
    let v = parseFloat(val);
    if (isNumber(v)) {
      return Number.isInteger(v) ? v : Math.round(v);
    }
  }
  return 0;
}

/**
 *
 * @param n {number} number to pad with leading zeros.
 * @param width {number} total width of string (eg. 3 for '005').
 * @param [z='0'] {char} character with which to pad string.
 * @returns {String}
 */
function pad(n, width, z) {
  z = z ? z : '0';
  const sn = String(n);
  return sn.length >= width ? sn : new Array(width - sn.length + 1).join(z) + sn;
}

/**
 * Float precision that returns a set number of digits after the decimal
 * @param {number} num - number to round
 * @param {number} dec - number of digits after decimal
 * @return {number} num rounded
 */
function roundNumber(num, dec) {
  dec = isInteger(dec) ? dec : 3;
  const factor = Math.pow(10, dec);
  return Math.round(num * factor) / factor;
}

/**
 * Convert string of form 'myClass' to 'my-class'
 * @param str
 */
function camelToDash(str) {
  return str
    .replace(REGEX.firstUppercase, ([first]) => first.toLowerCase())
    .replace(REGEX.allUppercase, ([letter]) => `-${letter.toLowerCase()}`);
}

function googleDate(jsDate) {
  const d = new Date(jsDate);
  const tNull = new Date(Date.UTC(1899, 11, 30, 0, 0, 0, 0)); // the starting value for Google
  return ((d.getTime() - tNull.getTime()) / 60000 - d.getTimezoneOffset()) / 1440;
}

function delayPromise(ms) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}

function msToObj(milliseconds) {
  let result = {
    timestring: '', // for text message use
    notistring: '', // for audible message use
    s: parseInt(milliseconds / 1000) % 60,
    m: parseInt(milliseconds / 60000) % 60,
    h: parseInt(milliseconds / 3600000) % 60,
    d: parseInt(milliseconds / 86400000) % 24,
  };
  if (result.d > 0) {
    result.timestring = result.d + 'D ';
    result.notistring = result.d + ' days ';
  }
  if (result.d > 0 && result.h < 10) {
    result.timestring = result.timestring + '0';
  }
  if (result.h > 0) {
    result.timestring = result.timestring + result.h + ':';
  }
  if (result.h > 0 || result.notistring !== '') {
    result.notistring = result.h + ' hours ';
  }
  if (result.m < 10 && result.timestring.length) {
    result.timestring = result.timestring + '0';
  }
  result.timestring = result.timestring + result.m + ':';
  if (result.m || result.notistring !== '') {
    result.notistring += result.m + ' minutes ';
  }
  if (result.s < 10) {
    result.timestring = result.timestring + '0';
  }
  result.notistring += result.s + ' seconds';
  result.timestring = result.timestring + result.s;
  return result;
}

function msToString(milliseconds) {
  return msToObj(milliseconds).timestring;
}
