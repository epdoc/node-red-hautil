"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delayPromise = delayPromise;
exports.googleDate = googleDate;
exports.msToObj = msToObj;
exports.msToString = msToString;
/**
 * Convert a javascript Date object to a date value used by Google Sheets.
 * @param {*} jsDate A value that is passed to a Date constructor
 * @returns
 */
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

/**
 * Convert a millsecond time (duration) value to an object and string.
 * @param {} milliseconds
 * @returns
 */
function msToObj(milliseconds) {
  let result = {
    timestring: '',
    // for text message use
    notistring: '',
    // for audible message use
    s: parseInt(milliseconds / 1000, 10) % 60,
    m: parseInt(milliseconds / 60000, 10) % 60,
    h: parseInt(milliseconds / 3600000, 10) % 60,
    d: parseInt(milliseconds / 86400000, 10) % 24
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