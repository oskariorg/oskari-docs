# Event

*List of all Oskari events can be found [here](/api/events).*

Events are a way to communicate with other bundles. They are used by bundles to notify other components in an Oskari application that something has happened. The bundle sends an event through [Oskari core](/documentation/core-concepts/oskari-core) and any bundle registered as an eventlistener for the given event is then notified about the event. For example, when a map is moved, [mapmodule](/documentation/bundles/framework/mapmodule) sends an event called AfterMapMoveEvent. The components which need to know about the mapmove need an eventHandler for AfterMapMoveEvent to get the information and to react to it. For example, the [indexmap-plugin](/documentation/bundles/framework/mapmodule/indexmap) has an eventHandler for AfterMapMoveEvent, and when the mapmodule sends AfterMapMoveEvent, the indexmap gets the information and reacts to it by updating the extent-map to the current location.  

Bundles implementing the `Oskari.mapframework.module.Module` protocol can register to Oskari framework and start receiving events. Events are handled by module protocol's `onEvent(event)` method. Common practice is that it checks the modules `eventHandlers` definition with the events name and calls the matching method if it founds one.

In practise, events are send to all components that are listening to it whereas requests can have only one handler.

<div class="bs-callout bs-callout-info">
    <h4>Main steps for using events:</h4>

    <ol>
    	<li> <a href="#1-define-an-event">Define an event </a></li>
    	<li> <a href="#2-sending-an-event-eventbuilder-">Create an event and notify other components about it</a></li>
    	<li> <a href="#3-listening-to-events-eventhandler-">Create eventHandler for the component that is interested about the event</a></li>
    </ol>
</div>


## 1. Define an event

```javascript
/**
 * @class Oskari.<mynamespace>.bundle.<mybundle>.event.MyEvent
 *
 * Used to notify components that ...
 */
Oskari.clazz.define('Oskari.<mynamespace>.bundle.<mybundle>.event.MyEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} param some information you wish to communicate with the event
 */
function(param) {
    this._param = param;
}, {
    /** @static @property __name event name */
    __name : "<mybundle>.MyEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getParameter
     * Returns parameter that components reacting to event should know about
     * @return {String}
     */
    getParameter : function() {
        return this._param;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
```
Example: defining `AfterMapMoveEvent`

```javascript
/**
 * @class Oskari.mapframework.event.common.AfterMapMoveEvent
 *
 * Notifies application bundles that a map has moved.
 * See Oskari.mapframework.request.common.MapMoveRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapMoveEvent',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Number} centerX
     *            longitude
     * @param {Number} centerY
     *            latitude
     * @param {Number} zoom
     *            map zoomlevel (0-12)
     * @param {Boolean} marker
     *            this should be removed, always sent as false
     * @param {Number} scale
     *            map scale
     * @param {String} creator
     *            class identifier of an object that sends an event
     */

    function (centerX, centerY, zoom, marker, scale, creator) {
        this._creator = creator || null;

        this._centerX = centerX;
        this._centerY = centerY;
        this._zoom = zoom;
        this._marker = marker;
        this._scale = scale;
    }, {
        /** @static @property __name event name */
        __name: "AfterMapMoveEvent",
        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getCreator
         * @return {String} identifier for the event sender
         */
        getCreator: function () {
            return this._creator;
        },
        /**
         * @method getCenterX
         * @return {Number} longitude
         */
        getCenterX: function () {
            return this._centerX;
        },
        /**
         * @method getCenterY
         * @return {Number} latitude
         */
        getCenterY: function () {
            return this._centerY;
        },
        /**
         * @method getZoom
         * @return {Number} zoomlevel (0-12)
         */
        getZoom: function () {
            return this._zoom;
        },
        /**
         * @method getMarker
         * @return {Boolean} this should be removed, always set to false
         * @deprecated use Oskari.mapframework.sandbox.Sandbox.getMap() ->
         * Oskari.mapframework.domain.Map.isMarkerVisible()
         */
        getMarker: function () {
            return this._marker;
        },
        /**
         * @method getScale
         * @return {Number} map scale
         */
        getScale: function () {
            return this._scale;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
```

## 2. Sending an event (`eventBuilder`)

Events are created by getting a builder for the event from sandbox and calling it with the constructor parameters. The sandbox's `notifyAll()` method is used to send out the created event.

```javascript
var sandbox = <get reference to sandbox>,
    eventBuilder = sandbox.getEventBuilder('<mybundle>.MyEvent'),
    event = eventBuilder('important info here');

sandbox.notifyAll(event);
```
Example of creating eventBuilder for AfterMapMoveEvent in map-module.js

```javascript
/**
 * @method notifyMoveEnd
 * Notify other components that the map has moved. Sends a AfterMapMoveEvent and updates the
 * sandbox map domain object with the current map properties.
 * Ignores the call if map is in stealth mode. Plugins should use this to notify other components
 * if they move the map through OpenLayers reference. All map movement methods implemented in mapmodule
 * (this class) calls this automatically if not stated otherwise in API documentation.
 * @param {String} creator
 * class identifier of object that sends event
 */

        notifyMoveEnd: function (creator) {
            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            var sandbox = this.getSandbox();
            sandbox.getMap().setMoving(false);

            var lonlat = this._getMapCenter();
            this._updateDomainImpl();
            var evt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat.lon, lonlat.lat, this._getMapZoom(), false, this._getMapScale(), creator);
            sandbox.notifyAll(evt);
        }

```
## 3. Listening to events (`eventHandler`)

Any registered module can listen to events. The module needs to tell sandbox that it is interested in the event by calling `registerForEventByName(<module>, '<event name>')`. The modules `onEvent` method is called when the event is received.

```javascript
Oskari.getSandbox().register(this);

this.eventHandlers = {
    'AfterMapLayerAddEvent': function(event) {
        console.log(event);
    }
};

this.onEvent = function(event) {
    var eventHandler = this.eventHandlers[event.getName()];
    if (eventHandler) eventHandler.apply(this, [event]);
}

for (var p in this.eventHandlers) {
    sandbox.registerForEventByName(this, p);
}
```
Example: IndexMapPlugin listening to `AfterMapMoveEvent`.

```javascript
/**
* using eventHandlers to define the events the component is interested in  
*/

eventHandlers: {
            'AfterMapMoveEvent': function (event) {
                if (this._indexMap && (event.getCreator() !== this.getClazz())) {
                    this._indexMap.update();
                }
            },
            'LayerToolsEditModeEvent': function (event) {
                this._setLayerToolsEditMode(event.isInMode());
            }
        };

/**
* registering to sandbox events the component is interested in
*/

me._sandbox.register(me);
for (p in me.eventHandlers) {
    if (me.eventHandlers.hasOwnProperty(p)) {
    me._sandbox.registerForEventByName(me, p);
    }
}

/**
 * @method onEvent
 * Event is handled forwarded to correct #eventHandlers if found or discarded if not
 */

onEvent: function (event) {
    console.log(event);
    return this.eventHandlers[event.getName()].apply(this, [event]);
}

```

<div class="bs-callout bs-callout-info">
    <h4>Try this out in console!</h4>

    <p>Copy and paste the following code to console and move the map. The event should get logged into the console</p>

<pre><code>(function (sb) {
    var fakeModule = {
        init: function (sb) {
            sb.registerForEventByName(this, 'AfterMapMoveEvent');
        },
        getName: function () {
            return 'FakeModule';
        },
        onEvent: function (event) {
            console.log(event);
        }
    };

    sb.register(fakeModule);
})(Oskari.getSandbox());</code></pre>
</div>
