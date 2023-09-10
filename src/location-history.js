export function newLocationHistory(options) {
  return new LocationHistory(options);
}

export class LocationHistory {
  history = {};
  warn = null;
  dirty = false;

  constructor(options) {
    this.GATE_HISTORY = 'gate_history';
    this.history = {};
    this.options = options || {};
    this.warn = isFunction(this.options.warn) ? this.options.warn : null;
    this.dirty = isBoolean(this.options.dirty) ? this.options.dirty : false;

    this.read();
  }

  read() {
    this.history = this.options.getStorage(this.GATE_HISTORY) || {};
    return this;
  }

  add(person, location, time) {
    let items = this.history[person];
    if (!Array.isArray(items)) {
      items = [];
    }
    items.push({ location: location, time: time });
    this.history[person] = items;
    this.dirty = true;
    return this;
  }

  /**
   * Find the person at any one of the locations, after the time defined by tCutoff
   * @param {} person
   * @param {*} tCutoff date (ms)
   * @param {*} locations Individual or array of location names
   * @returns
   */
  find(person, tCutoff, locations) {
    locations = isArray(locations) ? locations : [locations];
    const items = this.history[person];
    let result = false;
    if (isArray(items)) {
      for (let idx = 0; idx < items.length && !result; ++idx) {
        const item = items[idx];
        this.warn &&
          this.warn(`Entry: (${item.location}, ${new Date(item.time).toLocaleTimeString()})`);
        for (let ldx = 0; ldx < locations.length && !result; ++ldx) {
          const location = locations[ldx];
          this.warn &&
            this.warn(
              `Testing (${item.location}, ${new Date(
                item.time,
              ).toLocaleTimeString()}) against location ${location} cutoff ${new Date(
                tCutoff,
              ).toLocaleTimeString()}.`,
            );
          if (item.location === location && tCutoff < item.time) {
            result = true;
          }
        }
      }
    }
    return result;
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
      this.setStorage(this.GATE_HISTORY, this.history);
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
