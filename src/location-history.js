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

  /**
   * Find the person at any one of the locations, after the time defined by tCutoff
   * @param {} person
   * @param {*} tCutoff date (ms)
   * @param {*} locations Individual or array of location names
   * @returns Array of objects containing matches { location, time: ms }
   */
  person(person) {
    this.state = {
      person: person,
      items: isArray(this.history[person]) ? this.history[person] : [],
    };
    return this;
  }

  cutoff(tCutoffMs) {
    this.state.tCutoffMs = tCutoffMs;
    if (isNonEmptyArray(this.state.items)) {
      let newItems = [];
      for (let idx = 0; idx < this.state.items.length; ++idx) {
        const item = this.state.items[idx];
        if (tCutoffMs < item.time) {
          newItems.push(item);
        }
      }
      this.state.items = newItems;
    }
    return this;
  }

  locations(locations) {
    this.state.locations = isArray(locations) ? locations : [locations];
    if (isNonEmptyArray(this.state.items)) {
      let newItems = [];
      for (let ldx = 0; ldx < locations.length; ++ldx) {
        const location = locations[ldx];
        for (let idx = 0; idx < this.state.items.length; ++idx) {
          const item = this.state.items[idx];
          if (location === item.location) {
            newItems.push(item);
          }
        }
      }
      this.state.items = newItems;
    }
    return this;
  }

  sortByLocation() {
    if (isNonEmptyArray(this.state.locations) && isNonEmptyArray(this.state.items)) {
      this.state.items.sort((a, b) => {
        let adx = this.state.locations.indexOf(a.location);
        let bdx = this.state.locations.indexOf(b.location);
        return adx < bdx ? -1 : bdx < adx ? 1 : 0;
      });
    }
    return this;
  }

  found() {
    return this.state && isNonEmptyArray(this.state.items);
  }

  numFound() {
    return this.found() ? this.state.items.length : 0;
  }

  orderedByTime() {
    let result = false;
    if (isNonEmptyArray(this.state.items)) {
      result = true;
      for (let mdx = 0; mdx < this.state.items.length - 1; ++mdx) {
        if (this.state.items[mdx].time > this.state.items[mdx + 1].time) {
          return false;
        }
      }
    }
    return result;
  }

  moving() {
    return this.sortByLocation().orderedByTime();
  }

  _prune() {
    if (this.state.items.length !== this.history[this.state.person]) {
      this.dirty = true;
      this.history[this.state.person] = this.state.items;
    }
    return this;
  }

  pruneAll(tCutoffMs) {
    Object.keys(this.history).forEach((person) => {
      this.person(person).cutoff(tCutoffMs)._prune();
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

  toString() {
    let result = {};
    Object.keys(this.history).forEach((key) => {
      const items = this.history[key];
      result[key] = [];
      if (isArray(items)) {
        for (let idx = 0; idx < items.length; ++idx) {
          const item = items[idx];
          const newItem = {
            location: item.location,
            time: new Date(item.time).toLocaleTimeString(),
          };
          result[key].push(newItem);
        }
      }
    });
    return JSON.stringify(result);
  }
}
