export function newLocationMoving(person, history, oldLocation, newLocation) {
  return new LocationMoving(person, history, oldLocation, newLocation);
}

export class LocationMoving {
  person;
  history;
  oldLocation;
  newLocation;

  constructor(person, history, oldLocation, newLocation) {
    this.person = person;
    this.history = history;
    this.oldLocation = oldLocation;
    this.newLocation = newLocation;
  }

  moving(locations, tCutoffMs) {
    let result = false;
    for (let ldx = locations.length - 1; ldx >= 0 && !result; --ldx) {
      if (this.newLocation === locations[ldx]) {
        const before = locations.slice(0, ldx);
        if (before.find(this.oldLocation)) {
          result = true;
        } else {
          for (let bdx = 0; bdx < before.length - 1 && !result; ++bdx) {
            if (this.history.find(this.person, tCutoffMs, before[bdx])) {
              result = true;
            }
          }
        }
      }
    }
    return result;
  }
}
