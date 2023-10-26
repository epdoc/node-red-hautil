import { Dict, isArray, isFunction } from 'epdoc-util';
import { FunctionLog, LogOpts } from './function-log';
import { HistoryFilter } from './history-filter';
import { EpochMilliseconds } from './types';

export type Person = string;
export type HistoryLocation = string;
export type Time = any;
export type LocationHistoryItem = {
  location: HistoryLocation;
  time: EpochMilliseconds;
};
export type LocationHistoryOptions = LogOpts & {
  getStorage?: (string) => Dict;
  setStorage?: Function;
};

export function newLocationHistory(options) {
  return new LocationHistory(options);
}

export class LocationHistory extends FunctionLog {
  private GATE_HISTORY = 'gate_history';
  public history = {};
  dirty = false;
  getStorage = null;
  setStorage = null;

  constructor(options?: LocationHistoryOptions) {
    super(options as LogOpts);
    this.getStorage = isFunction(options.getStorage) ? options.getStorage : null;
    this.setStorage = isFunction(options.setStorage) ? options.setStorage : null;

    this.read();
  }

  read() {
    if (this.getStorage) {
      this.history = this.getStorage(this.GATE_HISTORY) || {};
    }
    return this;
  }

  add(person: Person, location: HistoryLocation, time: EpochMilliseconds) {
    let oldItems = this.history[person];
    if (!isArray(oldItems)) {
      oldItems = [];
    }
    let newItems = [];
    // If an entry already exists at this location, remove it
    for (let idx = 0; idx < oldItems.length; ++idx) {
      const item = oldItems[idx];
      if (item.location !== location) {
        newItems.push(item);
      }
    }
    newItems.push({ location: location, time: time });
    this.history[person] = newItems;
    this.dirty = true;
    return this;
  }

  /**
   * Return a HistoryFilter object that can be used to filter location history for this person
   * @param {string} person
   * @returns
   */

  filter(person: Person): HistoryFilter {
    return new HistoryFilter(person, isArray(this.history[person]) ? this.history[person] : []);
  }

  /**
   * Find the person at any one of the locations, after the time defined by tCutoff
   * @param {} person
   * @param {*} tCutoff date (ms)
   * @param {*} locations Individual or array of location names
   * @returns Array of objects containing matches { location, time: ms }
   */
  person(person: Person): HistoryFilter {
    return this.filter(person);
  }

  prune(tCutoff: EpochMilliseconds): LocationHistory {
    Object.keys(this.history).forEach((key) => {
      const items = this.history[key];
      let newItems = [];
      if (isArray(items)) {
        for (let idx = 0; idx < items.length; ++idx) {
          const item: LocationHistoryItem = items[idx];
          if (tCutoff < item.time) {
            newItems.push(item);
          }
        }
      }
      if (!isArray(items) || newItems.length !== items.length) {
        this.history[key] = newItems;
        this.dirty = true;
      }
    });
    return this;
  }

  flush(): LocationHistory {
    if (this.dirty) {
      if (this.setStorage) {
        this.setStorage(this.GATE_HISTORY, this.history);
      }
      this.dirty = false;
    }
    return this;
  }

  toString(tNow: EpochMilliseconds): string {
    tNow = tNow ? tNow : new Date().getTime();
    let result = {};
    Object.keys(this.history).forEach((key) => {
      const items: LocationHistoryItem[] = this.history[key];
      result[key] = [];
      if (isArray(items)) {
        for (let idx = 0; idx < items.length; ++idx) {
          result[key].push(LocationHistory._itemToString(items[idx], tNow));
        }
      }
    });
    return JSON.stringify(result);
  }

  static _itemToString(item: LocationHistoryItem, tNow: EpochMilliseconds): Dict {
    return {
      location: item.location,
      time: item.time - tNow,
    };
  }
}
