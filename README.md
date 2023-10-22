# hassio-node-red-utils

General purpose utilities for use with Node-RED and Home Assistant.

 * `Service` wrapper, to generate payloads for use with the Call Service node.
 * `HA` wrapper, to retrieve state from home assistant

Utilities for my personal use of Node-RED with Home Assistant. Included are:

 * A `setFan` function that is specific to my RF control of fans using both a
   [Bond Bridge](https://bondhome.io/product/bond-bridge/) to control speed, and
   wall switches to decouple the fans from power when they are off. I do this to
   prevent mains noise from blowing the delicate controllers on my Minka fans.
 * `LocationHistory` and `LocationMoving` classes that I use to monitor movement
   from our house, for gate automation purposes.

## Service

The Service object is used to build a payload that can be passed to the Call
Service node. There are a number of subclasses for specific types of entities,
including SwitchService, LightService, AlarmService, CoverService and
FanSpeed6Service which is a 6-speed fan. 

There is the possibility for many more subclasses, or you can build your service
payload directly using the base Service class, or one of the other subclasses. 

The following shows the code for a function node that uses three equivalent
implementations to tell a Cover to stop.

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

## HA

```js
const gHA = global.get('homeassistant');

const ha = new HA(gHA);
const light = ha.entity('light.bedroom');
console.log()
```