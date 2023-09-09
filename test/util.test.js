require('../src/utils');

describe('util', () => {
  describe('type', () => {
    const obj = {
      a: 'b',
      c: 'd',
      e: 4,
    };

    it('isString', () => {
      expect(isString('string')).toBe(true);
      expect(t({ a: 'string' }).property('a').isString()).toBe(true);
      expect(
        t({ a: { b: 'string' } })
          .prop('a.b')
          .isString(),
      ).toBe(true);
      expect(
        t({ a: { b: 'string' } })
          .property('a.c')
          .isString(),
      ).toBe(false);
      expect(isString(4)).toBe(false);
    });

    it('isNonEmptyString', () => {
      let s = 'my string';
      expect(isNonEmptyString(s)).toBe(true);
      expect(s).toEqual('my string');
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(4)).toBe(false);
    });

    it('isArray', () => {
      expect(isArray(['string'])).toBe(true);
      expect(isArray(4)).toBe(false);
      expect(isArray({ a: 'string' })).toBe(false);
    });

    it('isBoolean', () => {
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(undefined)).toBe(false);
    });

    it('isNumber', () => {
      expect(isNumber(4)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber({})).toBe(false);
    });

    it('isPosNumber', () => {
      expect(isPosNumber(4)).toBe(true);
      expect(isPosNumber(NaN)).toBe(false);
      expect(isPosNumber(-0.01)).toBe(false);
      expect(isPosNumber(0)).toBe(false);
    });

    it('isInteger', () => {
      expect(isInteger(4)).toBe(true);
      expect(isInteger(NaN)).toBe(false);
      expect(isInteger(0.2)).toBe(false);
      expect(isInteger(0)).toBe(true);
      expect(isInteger(-1)).toBe(true);
    });

    it('isFunction', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction(3)).toBe(false);
      expect(isFunction(false)).toBe(false);
      expect(isFunction(() => {})).toBe(true);
    });

    it('isNull', () => {
      expect(isNull(null)).toBe(true);
      expect(isNull(false)).toBe(false);
      expect(isNull(() => {})).toBe(false);
    });

    it('isDefined', () => {
      expect(isDefined(null)).toBe(true);
      expect(isDefined(undefined)).toBe(false);
      expect(isDefined(false)).toBe(true);
      expect(isDefined(() => {})).toBe(true);
    });

    it('hasValue', () => {
      expect(hasValue('test')).toBe(true);
      expect(hasValue(NaN)).toBe(true);
      expect(hasValue(0.2)).toBe(true);
      expect(hasValue(0)).toBe(true);
      expect(hasValue(undefined)).toBe(false);
      expect(hasValue(null)).toBe(false);
      expect(hasValue({})).toBe(true);
    });

    it('isRegExp', () => {
      expect(isRegExp(/^.*$/)).toBe(true);
      expect(isRegExp({})).toBe(false);
      expect(isRegExp(false)).toBe(false);
      expect(isRegExp(Date.now())).toBe(false);
      expect(isRegExp(() => {})).toBe(false);
    });

    it('isObject', () => {
      expect(isObject(/^.*$/)).toBe(false);
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(false)).toBe(false);
      expect(isRegExp(Date.now())).toBe(false);
      expect(isObject(() => {})).toBe(false);
      expect(isObject(undefined)).toBe(false);
    });

    it('isDate', () => {
      expect(isDate(/^.*$/)).toBe(false);
      expect(isDate({})).toBe(false);
      expect(isDate(false)).toBe(false);
      expect(isDate(233433)).toBe(false);
      expect(isDate(new Date())).toBe(true);
      expect(isDate(() => {})).toBe(false);
    });

    it('isError', () => {
      expect(isError(/^.*$/)).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError(false)).toBe(false);
      expect(isError(new Error())).toBe(true);
      expect(isError(() => {})).toBe(false);
    });

    describe('translate', () => {
      it('camelToDash', () => {
        expect(camelToDash('myStringHere')).toEqual('my-string-here');
        expect(camelToDash('MyStringHere')).toEqual('my-string-here');
      });
      it('pad', () => {
        expect(pad(32, 4)).toEqual('0032');
        expect(pad(32, 4, 'a')).toEqual('aa32');
        expect(pad(32, 2)).toEqual('32');
      });
      it('asInt', () => {
        expect(asInt(32)).toEqual(32);
        expect(asInt(32.5)).toEqual(33);
        expect(asInt(9.49)).toEqual(9);
        expect(asInt('9.49')).toEqual(9);
        expect(asInt('11.5')).toEqual(12);
        expect(asInt('aba')).toEqual(0);
        expect(asInt([])).toEqual(0);
      });
      it('asFloat', () => {
        expect(asFloat(32)).toEqual(32);
        expect(asFloat(32.5)).toEqual(32.5);
        expect(asFloat('32.5')).toEqual(32.5);
        expect(asFloat('9.49')).toEqual(9.49);
        expect(asFloat('11.5')).toEqual(11.5);
        expect(asFloat('aba')).toEqual(0);
        expect(asFloat('aba', { def: 4 })).toEqual(4);
        expect(asFloat('32,222,456.55')).toEqual(32222456.55);
        expect(asFloat('32.222.456,55', { commaAsDecimal: true })).toEqual(32222456.55);
        expect(asFloat([])).toEqual(0);
      });
    });
  });
});
