import { Integer } from 'epdoc-util';

export type HomeAssistantEntityState = any;

export class EntityState {
  private _state: HomeAssistantEntityState;

  constructor(state: HomeAssistantEntityState) {
    this._state = state;
  }
  equals(val: any): boolean {
    return this._state === val;
  }

  isOn(): boolean {
    return this.equals('on');
  }
  isOff(): boolean {
    return this.equals('off');
  }
  asNumber(defval?: number): number | undefined {
    return this._state ? parseFloat(this._state) : defval;
  }
  asInt(defval?: Integer): Integer | undefined {
    return this._state ? parseInt(this._state, 10) : defval;
  }
  asInteger(defval?: Integer): Integer | undefined {
    return this.asInt(defval);
  }
  toString(): string {
    return this._state;
  }

  value(): any {
    return this._state;
  }
}
