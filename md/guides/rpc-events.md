# RPC events

This guide shows how to enable an Oskari event to be transmitted via RPC. This enables the embedding page to be able to
react to events on the embedded application. Existing Oskari events are listed [here](/api/events).

1) Implement a getParams() function for the Oskari-event:

```javascript
    /**
     * Serialization for RPC
     * @return {Object} object that includes event properties
     */
    getParams: function () {
        return {
            'key': 'value'
        };
    }
```

2) Allow the event to be transmitted via RPC:

Either modifying the default allowed events in Oskari/bundles/framework/rpc/instance.js:

```javascript
     allowedEvents = {
        'AfterMapMoveEvent': true,
        'MapClickedEvent': true,
        'AfterAddMarkerEvent' : true,
        'MarkerClickEvent' : true,
        'MyCustomEvent' : true
     };
```

Or use the RPC bundle configuration to declare additional events for specific application:
[RPC bundle documentation](/documentation/bundles/framework/rpc)
