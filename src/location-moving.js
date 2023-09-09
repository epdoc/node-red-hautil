(function () {
  require('util');

  let LocationMoving = function () {
    function LocationMoving(person, history, oldLocation, newLocation) {
      this.person = person;
      this.history = history;
      this.newLocation = newLocation;
    }

    LocationMoving.prototype.moving = function (locations, tCutoffMs) {
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
    };
  };
});
