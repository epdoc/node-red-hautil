# @epdoc/node-red-hautil

<span style="color:gold">**THIS PROJECT IS STILL IN DEVELOPMENT. 
All APIs and documentation are subject to change.**</span>

General purpose utilities for use with [Node-RED](https://nodered.org/) and
[Home Assistant](https://www.home-assistant.io/).

 * `Service` wrapper, to generate payloads for use with the Call Service node.
 * `HA` wrapper, to retrieve state from home assistant


# Build

```zsh
git clone @epdoc/node-red-hautil
cd node-red-hautil
npm install
npm test
npm run build
npm run publish
```

# Installation and Configuration for use in Standalong Node-RED

Standalone Node-RED refers to an instance of a Node-RED server that you've
installed and configured and that does not use the Home Assistant [Node-RED
Addon](https://github.com/hassio-addons/addon-node-red).

In the Node-Red settings folder for your standalone Node-RED deployment, add these
dependencies to _package.json_.

```zsh
npm install node-red-contrib-home-assistant-websocket
npm install @epdoc/typeutil @epdoc/node-red-hautil
```

Start or restart Node-Red. The nodes in
_node-red-contrib-home-assistant-websocket_ will appear automatically in your node
list.

## Node-RED running manually

You can use `pm2 start node-red` or
`pm2 restart node-red`. Or you can add these script commands to your `package.json` file.

```json
  "scripts": {
    "start": "pm2 start node-red",
    "restart": "pm2 restart node-red",
    "stop": "pm2 stop node-red"
  }
```

## Node-RED with Home Assistant Add-on

If Node-Red is running under
Home Assistant you can restart Node-RED from _Settings > Add-ons > Node-Red_. 

For module updates you can edit the version number in `package.json`, delete
`node_modules/@epdoc/node-red-hautil`, then restart Node-RED.


## Configure a Home Assistant Server

For a standalone deployment, drag one of the home assistant nodes onto a flow page. Open the node and add a new `Server` by clicking the pencil icon.

On the server `Properties` tab enter the following:

- Name - a distinguishing name for this particular home assistant server
- Base URL - Something of the form http://10.0.0.10:8123
- Access Token - Get a long lived access token from the home assistant UI by clicking your profile icon (lower right corner), opening the security tab and scrolling to the bottom of the page.
- Enable global context store - Enable this so that `global.get('homeassistant')` will work in your function nodes.

Once created, the server settings can subsequently be found and edited in the _Configuration Nodes_ tab.


## Load @epdoc/node-red-hautil

For convenience you can add `@epdoc/node-red-hautil` and other utilities to the
global context, so that you don't need to specify the module in each `Function
Node` where it is used. 

You can find a discussion of various ways to use your own
libraries in Node-RED [here](./NODE-RED.md).

# Library Reference

## Service Class

The
[Service](https://github.com/jpravetz/epdoc-node-red-hautil/blob/master/src/service.ts)
object is used to build a payload that can be passed to the [Call Service
node](https://zachowj.github.io/node-red-contrib-home-assistant-websocket/node/call-service.html).
Provided too are a number of subclasses for specific types of entities,
including `SwitchService`, `LightService`, `AlarmService`, `CoverService`,
`FanService` and, finally `FanSpeed6Service`, which is a 6-speed fan that uses a
[Bond Bridge](https://bondhome.io/product/bond-bridge/) to set the fan speed and
a smart switch to turn the fans on and off. 

There is the possibility for many more subclasses to be written, or you can
build your service payload directly using the base `Service` class, or one of
the other subclasses. 

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

The
[HA](https://github.com/jpravetz/epdoc-node-red-hautil/blob/master/src/service.tsbond)
class provides a wrapper for a Home Assistant instance, and has methods to
access the state of Home Assitant entities.

Example retrieves the state of a light.

```js
const ha = new HA(global,'homeAssistant');
const lightEntity = ha.entity('light.bedroom');
const isOn = lightEntity.isOn();
node.warn(`The ${lightEntity.id} is ${isOn?'on':'off'}`)
```

### HA retrieveSensorsData method

This method takes a dictionary containing an `id` field and optional `type`
field and retrieves sensor data for the listed sensors. This is a shortcut that
you might use when you have multiple sensors that you efficiently want to get
data for, and you need to access that data more than once.

```js
const gHA = global.get('homeassistant');
const homeAssistant:HomeAssistant = gHA['homeAssistant']
const ha = new HA(homeAssistant);

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
const ha = new HA(global);

if( ha.entity('input_boolean.evening').isOn() ) {
  console.log('It is the evening');
}
if( ha.entity('sensor.outdoor_temperature').asNumber() > 30 ) {
  console.log('It is hot today');
}
```

## Developer Notes

This module was originally written in ES6 and transpiled using Babel to generate
a module that could be loaded using `require` or `import`. Soon thereafter it
was migrated to TypeScript (developer hint: this resulted in catching quite a
few bugs). It was also migrated to [Bun](https://bun.sh/) for package management
and unit testing, however the Typescript Compiler (tsc) is used for module
generation, due to limitations in bun's bundling options . 
