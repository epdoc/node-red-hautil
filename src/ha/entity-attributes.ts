import { Dict, deepCopy, isDefined, isNumber } from '@epdoc/typeutil';

export type HAEntityAttributesData = Dict & {
  friendly_name: string;
  state_class?: 'measurement' | string;
  device_class?: 'temperature' | 'humidity' | 'illuminance' | 'duration' | 'humidity' | string;
  direction?: 'forward' | string;
  percentage?: number;
  percentage_step?: number;
  preset_mode?: any;
  preset_modes?: any;
  supported_features?: number;
  supported_color_modes?: string[];
  color_mode?: any;
  brightness?: number | null;
  icon?: 'string';
  unit_of_measurement?: string;
};

const STATE_IS_NUMBER = ['measurement'];

export class EntityAttributes {
  private _attributes: HAEntityAttributesData | undefined;

  constructor(val: HAEntityAttributesData | undefined) {
    this._attributes = val;
  }

  isValid(): boolean {
    return isDefined(this._attributes);
  }

  toString(): string {
    return String(this._attributes);
  }

  get name(): string | undefined {
    return this._attributes ? this._attributes.friendly_name : undefined;
  }

  percentage(defval: number = 0): number {
    if (this._attributes && isNumber(this._attributes.percentage)) {
      return this._attributes.percentage;
    }
    return defval;
  }

  isNumberClass(): boolean {
    if (this._attributes && this._attributes.state_class && STATE_IS_NUMBER.includes(this._attributes.state_class)) {
      return true;
    }
    return false;
  }

  toObject(): Dict {
    return deepCopy(this._attributes);
  }
  stringify(): string {
    return JSON.stringify(this.toObject());
  }
}
