import { deepCopy, isArray, isFunction, isNonEmptyArray } from 'epdoc-util';

export function newLocationHistory(options) {
  return new LocationHistory(options);
}

export class LocationHistory {
  history = {};
  warn = null;
  dirty = false;
  getStorage = null;
  setStorage = null;

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

  /**
   * Return a HistoryFilter object that can be used to filter location history for this person
   * @param {string} person
   * @returns
   */

  filter(person) {
    return new HistoryFilter(person, isArray(this.history[person]) ? this.history[person] : []);
  }

  /**
   * Find the person at any one of the locations, after the time defined by tCutoff
   * @param {} person
   * @param {*} tCutoff date (ms)
   * @param {*} locations Individual or array of location names
   * @returns Array of objects containing matches { location, time: ms }
   */
  person(person) {
    return this.filter(person);
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
    this._items = deepCopy(items);
  }

  /**
   * Filters out all history items that were set prior to this time.
   * @param {ms} tCutoffMs ms from UNIX epoch.
   * @returns self
   */
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

  /**
   * Filter out all history items that are not at the specified locations.
   * @param {array of strings} locations A string or array of strings.
   * @returns self
   */
  locations(locations) {
    this._locations = isArray(locations) ? locations : [locations];
    if (isNonEmptyArray(this._items) && isNonEmptyArray(this._locations)) {
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

  /**
   * Sorts the history items to be in the same order as they appear in the
   * previous call to locations().
   * @returns self
   */
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

  /**
   *
   * @returns true if there are filtered items remaining
   */
  found() {
    return isNonEmptyArray(this._items);
  }

  /**
   *
   * @returns The number of filtered items remaining.
   */
  numFound() {
    return this.found() ? this._items.length : 0;
  }

  /**
   * Evaluate whether the history items are ordered by time
   * @returns boolean Returns true if ordered by time.
   */
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

  /**
   * Determines if the person is moving in the direction of locations(), which
   * should have been called earlier. Will sort entries by location and
   * determine if they are ordered by time in the appropriate direction.
   * @returns true if moving in the direction given by the call to locations().
   */
  moving() {
    return this.sortByLocation().orderedByTime();
  }

  /**
   * Generates a JSON string that displays time as milliseconds from tNow.
   * @param {ms} tNow (optional) The reference time. Will be set to now if not
   * provided
   * @returns a JSON stringified array of history locations and times.
   */
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
