import { isArray, isFunction, isNonEmptyArray } from 'epdoc-util';

export function newLocationHistory(options) {
  return new LocationHistory(options);
}

export class LocationHistory {
  history = {};
  warn = null;
  dirty = false;
  getStorage = null;
  setStorage = null;
  state = {};

  constructor(options) {
    this.GATE_HISTORY = 'gate_history';
    this.history = {};
    this.options = options || {};
    this.warn = isFunction(this.options.warn) ? this.options.warn : null;
    this.getStorage = isFunction(this.options.getStorage) ? this.options.getStorage : null;
    this.setStorage = isFunction(this.options.setStorage) ? this.options.setStorage : null;

    this.read();
  }

  read() {
    if (this.getStorage) {
      this.history = this.getStorage(this.GATE_HISTORY) || {};
    }
    return this;
  }

  add(person, location, time) {
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

  filter(person) {
    return this.person(person);
  }

  /**
   * Find the person at any one of the locations, after the time defined by tCutoff
   * @param {} person
   * @param {*} tCutoff date (ms)
   * @param {*} locations Individual or array of location names
   * @returns Array of objects containing matches { location, time: ms }
   */
  person(person) {
    this.state = new HistoryFilter(person, isArray(this.history[person]) ? this.history[person] : []);
    return this.state;
  }

  prune(tCutoff) {
    Object.keys(this.history).forEach((key) => {
      const items = this.history[key];
      let newItems = [];
      if (isArray(items)) {
        for (let idx = 0; idx < items.length; ++idx) {
          const item = items[idx];
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

  flush() {
    if (this.dirty) {
      if (this.setStorage) {
        this.setStorage(this.GATE_HISTORY, this.history);
      }
      this.dirty = false;
    }
    return this;
  }

  toString(tNow) {
    tNow = tNow ? tNow : new Date().getTime();
    let result = {};
    Object.keys(this.history).forEach((key) => {
      const items = this.history[key];
      result[key] = [];
      if (isArray(items)) {
        for (let idx = 0; idx < items.length; ++idx) {
          result[key].push(LocationHistory._itemToString(items[idx], tNow));
        }
      }
    });
    return JSON.stringify(result);
  }

  static _itemToString(item, tNow) {
    return {
      location: item.location,
      time: item.time - tNow,
    };
  }
}

class HistoryFilter {
  _person;
  _items = [];
  _locations;
  _tCutoffMs;

  constructor(person, items) {
    this._person = person;
    this._items = items;
  }

  cutoff(tCutoffMs) {
    this._tCutoffMs = tCutoffMs;
    if (isNonEmptyArray(this._items)) {
      let newItems = [];
      for (let idx = 0; idx < this._items.length; ++idx) {
        const item = this._items[idx];
        if (this._tCutoffMs < item.time) {
          newItems.push(item);
        }
      }
      this._items = newItems;
    }
    return this;
  }

  locations(locations) {
    this._locations = isArray(locations) ? locations : [locations];
    if (isNonEmptyArray(this._items)) {
      let newItems = [];
      for (let ldx = 0; ldx < this._locations.length; ++ldx) {
        const location = this._locations[ldx];
        for (let idx = 0; idx < this._items.length; ++idx) {
          const item = this._items[idx];
          if (location === item.location) {
            newItems.push(item);
          }
        }
      }
      this._items = newItems;
    }
    return this;
  }

  sortByLocation() {
    if (isNonEmptyArray(this._locations) && isNonEmptyArray(this._items) && this._items.length > 1) {
      this._items.sort((a, b) => {
        let adx = this._locations.indexOf(a.location);
        let bdx = this._locations.indexOf(b.location);
        return adx < bdx ? -1 : bdx < adx ? 1 : 0;
      });
    }
    return this;
  }

  found() {
    return isNonEmptyArray(this._items);
  }

  numFound() {
    return this.found() ? this._items.length : 0;
  }

  orderedByTime() {
    let result = false;
    if (isNonEmptyArray(this._items) && this._items.length > 1) {
      result = true;
      for (let mdx = 0; mdx < this._items.length - 1; ++mdx) {
        if (this._items[mdx].time > this._items[mdx + 1].time) {
          return false;
        }
      }
    }
    return result;
  }

  moving() {
    return this.sortByLocation().orderedByTime();
  }

  toString(tNow) {
    tNow = tNow ? tNow : new Date().getTime();
    let result = [];
    if (isArray(this._items)) {
      for (let idx = 0; idx < this._items.length; ++idx) {
        result.push(LocationHistory._itemToString(this._items[idx], tNow));
      }
    }
    return `(${this._person}) ` + JSON.stringify(result);
  }
}
