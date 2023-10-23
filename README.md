# hassio-node-red-utils

General purpose utilities for use with [Node-RED](https://nodered.org/) and
[Home Assistant](https://www.home-assistant.io/).

 * `Service` wrapper, to generate payloads for use with the Call Service node.
 * `HA` wrapper, to retrieve state from home assistant

Utilities for my personal use of Node-RED with Home Assistant. Included are:

 * A `setFan` function that is specific to my RF control of fans using both a
   [Bond Bridge](https://bondhome.io/product/bond-bridge/) to control speed, and
   wall switches to decouple the fans from power when they are off. I do this to
   prevent mains noise from blowing the delicate controllers on my Minka fans.
 * `LocationHistory` and `LocationMoving` classes that I use to monitor movement
   from our house, for gate automation purposes. These are at a pre-release
   level of quality.

## Installation and Use

I find the easiest way to install this package with Home Assistant is to add
this dependency to the Node-RED `package.json` file and restart Node-RED. This
should cause the module to be installed and available. For updates, I delete the
subfolder from the `node_modules` folder and restart Node-RED.

I also add the module to globals, so that I don't need to specify the module in
each function node where it is used.  Here are the required changes to
`settings.json` for this to work:

```json
  functionGlobalContext: {
    "epdoc-node-red-utils": require('epdoc-node-red-utils'),
    "epdoc-util": require('epdoc-util')
  },
```

Then, to use this code in a function node, it's a matter of accessing the global context:

```javascript
const utils = global.get("epdoc-node-red-utils");
node.warn(g.googleDate(new Date()));
```

I have a more exhaustive discussion of how to use your own libraries in Node-RED [here](./NODE-RED.md).

## Service Class

The `Service` object is used to build a payload that can be passed to the _Call
Service_ node. Provided too are a number of subclasses for specific types of
entities, including `SwitchService`, `LightService`, `AlarmService`,
`CoverService`, `FanService` and `FanSpeed6Service` which is a 6-speed fan. 

There is the possibility for many more subclasses, or you can build your service
payload directly using the base `Service` class, or one of the other subclasses. 

The following shows the code for a [function
node](https://nodered.org/docs/user-guide/writing-functions) that uses three
equivalent implementations to tell a
[Cover](https://www.home-assistant.io/integrations/cover/) to stop.

```js
let payload = newService('cover.garage').service('stop_cover').payload();

payload = new CoverService('garage').stop().payload();

let payloadBuilder = newCoverService('garage');
payload = payloadBuilder.stop().payload();
msg.payload = payload;
return msg;
```

The following function node code creates a payload that can be used to set a
light's brightness to 50%.

```js
msg.payload = new LightService('bedroom').percentage(50).payload();
return msg;
```

The following function node code shows several ways to create a payload that
turns a light on.

```js
// In this example we directly use the LightService, 
// which will set the domain to `light` for us. 
// The LightService is a subclass of SwitchService.
msg.payload = new LightService('bedroom').on().payload();

// In this example we use the SwitchService, but change it's default
// domain from `switch` to `light` by specifying the full `entity_id`.
msg.payload = new SwitchService('light.bedroom').on().payload();

// Override the default domain using the `domain` method.
msg.payload = new SwitchService('bedroom').domain('light').on().payload();
return msg;
```

## HA Class

```js
const gHA = global.get('homeassistant');

const ha = new HA(gHA);
const light = ha.entity('light.bedroom');
const isOn = light.isOn();
console.log()
```

### HA retrieveSensorsData method

This method takes a dictionary containing an `id` field and optional `type`
field and retrieves sensor data for the listed sensors. This is a shortcut that
you might use when you have multiple sensors that you quickly want to get data
for, and you need to access that data more than once.

```js
const gHA = global.get('homeassistant');
const ha = new HA(gHA);

const sensorDict = {
  sensor1: { id: 'input_boolean.evening', type: 'boolean' },
  sensor2: { id: 'sensor.outdoor_temperature', type: 'number' }
};

ha.retrieveSensorsData(sensorDict);
if( sensorDict.sensor1.on ) {
  console.log('It is the evening');
}
if( sensorDict.sensor2.val > 30 ) {
  console.log('It is hot today');
}
```

The above code is equivalent to the following:

```js
const gHA = global.get('homeassistant');
const ha = new HA(gHA);

if( ha.entity('input_boolean.evening').isOn() ) {
  console.log('It is the evening');
}
if( ha.entity('sensor.outdoor_temperature').asNumber() > 30 ) {
  console.log('It is hot today');
}
```