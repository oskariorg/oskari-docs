# Module

Modules are components that can be registered to Oskari. Registering allows these components to for example send requests and receive events. Registering a module also calls the module init method. Usually modules start listening to events and register request handlers on `start` methods. `stop` method is called when the module is stopped but they usually aren't stopped.

## Event methods

```javascript
/**
 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
 *
 * @method onEvent
 * @param {Oskari.mapframework.event.Event} event a Oskari event object
 */
onEvent : function(event) {
  var handler = this.eventHandlers[event.getName()];
  if(handler) return handler.apply(this, [event]);
},

/**
 * @property {Object} eventHandlers
 * @static
 */
eventHandlers : {
    /**
     * Reacts to MyEvent
     * @method MyEvent
     */
    'MyEvent' : function(event) {
        // handle event
    }
}
```