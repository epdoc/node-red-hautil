"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HA = exports.newHA = void 0;
const entity_1 = require("./entity");
const function_node_base_1 = require("./function-node-base");
function newHA(opts) {
    return new HA(opts);
}
exports.newHA = newHA;
/**
 * Class wraps a home assistant object, for use in Node-RED functions.
 */
class HA extends function_node_base_1.FunctionNodeBase {
    /**
     *
     * @param {Object} globalHomeAssistant The value of global.get('homeassistant')
     * @param {Function} options.log Function that takes a string as a parameter and that outputs log messages.
     */
    constructor(opts) {
        super(opts);
        this._ha = this.global.get('homeassistant');
    }
    get ha() {
        return this._ha;
    }
    /**
     *
     * @param {string} entity_id
     * @returns The entity object for the specified `entity_id`.
     */
    entity(entity_id) {
        return new entity_1.Entity(this._ha.states[entity_id]);
    }
    /**
     *
     * @param {*} entity_id
     * @returns
     */
    entityState(entity_id) {
        const entity = this.entity(entity_id);
        return entity ? entity.state() : undefined;
    }
    /**
     * For every entry in a dictionary, uses the id field to retrieve the Entity() object.
     * @param {Obj} sensorDict Object containing an id property which is an entity_id.
     */
    retrieveSensorsData(sensorDict) {
        for (const name in sensorDict) {
            if (sensorDict.hasOwnProperty(name)) {
                let item = sensorDict[name];
                item.entity = this.entity(item.id);
                if (item.type === 'boolean') {
                    if (item.entity.isOn()) {
                        item.on = true;
                        item.off = false;
                    }
                    else if (item.entity.isOff()) {
                        item.on = false;
                        item.off = true;
                    }
                }
                else if (item.type === 'number') {
                    item.val = item.entity.asNumber(item.defval);
                }
                else if (item.type === 'int') {
                    item.val = item.entity.asInt(item.defval);
                }
            }
        }
    }
}
exports.HA = HA;
//# sourceMappingURL=ha.js.map