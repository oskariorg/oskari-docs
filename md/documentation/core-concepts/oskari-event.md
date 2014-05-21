# Event

*List of all Oskari events can be found [here](/documentation/core-concepts/event-list).*

Events are used by bundles to notify other components in an Oskari application that something has happened. Of course it's good practice to only send out events about things that other components might be interested in. You don't need or want to spam the framework about every gory detail. Bundles implementing the `Oskari.mapframework.module.Module` protocol can register to Oskari framework and start receiving events. Events are handled by module protocol's `onEvent(event)` method. Common practice is that it checks the modules `eventHandlers` definition with the events name and calls the matching method if it founds one.

Oskari and the map module send out some events that extension bundles can listen and react to for example if the map moves or if the map is clicked. Chances are if you are sending a custom event none but your own components care about it so you need to implement an event handler as well. Technically the main difference between events and requests is that requests can have only one handler where as events can be handled by any number of handlers.

## Define an event

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

## Sending an event

Events are created by getting a builder for the event from sandbox and calling it with the constructor parameters. The sandbox's `notifyAll()` method is used to send out the created event.

```javascript
var sandbox = <get reference to sandbox>,
    eventBuilder = sandbox.getEventBuilder('<mybundle>.MyEvent'),
    event = eventBuilder('important info here');

sandbox.notifyAll(event);
```

## Listening to events

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
