import { Dict, Integer, isDefined, isInteger, isNumber, isString } from 'epdoc-util';

export type HAEntityStateData = 'on' | 'off' | number | string | Dict;

export class EntityState {
  private _state: HAEntityStateData | undefined;

  constructor(state: HAEntityStateData | undefined) {
    this._state = state;
  }

  isValid(): boolean {
    return isDefined(this._state);
  }

  equals(val: any): boolean {
    return this._state ? this._state === val : false;
  }

  isOn(): boolean {
    return this.equals('on');
  }
  isOff(): boolean {
    return this.equals('off');
  }
  asNumber(defval?: number): number | undefined {
    if (isString(this._state)) {
      return parseFloat(this._state);
    } else if (isNumber(this._state)) {
      return this._state;
    }
    return defval;
  }
  asInteger(defval?: Integer): Integer | undefined {
    if (isString(this._state)) {
      return parseInt(this._state, 10);
    } else if (isInteger(this._state)) {
      return this._state;
    } else if (isNumber(this._state)) {
      return Math.round(this._state);
    }
    return defval;
  }
  asInt(defval?: Integer): Integer | undefined {
    return this.asInteger(defval);
  }
  toString(): string {
    return String(this._state);
  }

  value(): any {
    return this._state;
  }
}
