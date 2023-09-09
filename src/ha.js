(function () {
  require('utils');
  require('fan');

  let HA = function () {
    function HA(ha, options) {
      this.ha = ha.homeAssistant;
      this.options = options || {};
      this.warn = isFunction(this.options.warn) ? this.options.warn : null;
    }

    HA.prototype.isEntityOn = function (entity_id) {
      const entity = this.ha.states[entity_id];
      return entity && entity.state === 'on' ? true : false;
    };

    /**
     * d.service = on, off, toggle, speed, percentage, arm_night, arm_away, arm_home, disarm
     */
    HA.prototype.getServicePayload = function (params) {
      let p = {
        service: params.service,
        target: {
          entity_id: params.entity_id,
        },
      };
      if (params.domain) {
        p.domain = params.domain;
      } else {
        const parts = params.entity_id.split('.');
        p.domain = parts[0];
      }
      if (params.service === 'on' || params.service === 'off') {
        p.service = 'turn_' + d.service;
      }
      if (params.domain === 'fan') {
        let fan = new Fan();
        if (params.service === 'speed') {
          p.service = 'set_percentage';
          p.data = {
            percentage: fan.speedToPercentage(params.speed),
          };
        } else if (params.service === 'percentage') {
          p.data = {
            percentage: params.percentage,
          };
        }
      } else if (params.domain === 'cover') {
        p.service = params.service + '_cover';
      } else if (params.domain === 'alarm_control_panel') {
        p.service = 'alarm_' + params.service;
      }
      return p;
    };

    /**
     *
     * @param {Obj} sensorDict Object containing an id property which is an entity_id.
     */
    HA.prototype.retrieveSensorsData = function (sensorDict) {
      for (const name in sensorDict) {
        if (sensorDict.hasOwnProperty(name)) {
          let item = sensorDict[name];
          item.obj = this.ha.states[item.id];
          if (item.obj) {
            item.state = item.obj.state;
          }
        }
      }
    };
  };
});
