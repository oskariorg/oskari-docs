# Request

Requests are used by bundles to ask another component in an Oskari application to do something. Request and requesthandlers can be defined in bundles so you need to be certain that you have the bundle included in your application setup if you are going to use its requests. See the list of all requests [here](/documentation/core-concepts/request-list).

You can test if a certain request can be sent by checking if a request builder can be constructed by `sandbox`

```javascript
var sandbox = Oskari.getSandbox(),
    requestBuilder = sandbox.getRequestBuilder('<Request name>'),
    request;

if (requestBuilder) {
    // got the builder, request can be sent
    request = requestBuilder(<request params>);
    sandbox.request(<module instance or registered modules name as string>, request);
}
```

If a request builder is returned, it's safe to assume that the bundle handling the request is part of the application setup. Guidelines rule that files defining requests and requesthandlers are located under a request folder under the bundle implementation.

Some basic requests (mostly map related) are defined and handled in the frameworks core and are always present. For example you can request the map to move to a certain location by sending a `MapMoveRequest`:

```javascript
var sandbox = Oskari.getSandbox(),
    longitude= '<...>',
    latitude= '<...>',
    zoomlevel = <0-12>,
    requestBuilder = sandbox.getRequestBuilder('MapMoveRequest'),
    request;

// request is part of the core, no need to check builder
request =  requestBuilder(longitude, latitude, zoomlevel);
sandbox.request(<reference to a registered module instance or its name as string>, request);
```

### Sample request definition

```javascript
/**
 * @class Oskari.<mynamespace>.bundle.<mybundle>.request.MyRequest
 *  
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.<mynamespace>.bundle.<mybundle>.request.MyRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            param what you want to request
 */
function(param) {
    this._param = param;
}, {
    /** @static @property __name request name */
    __name : "<mybundle>.MyRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getParameter 
     * @return {String} something you want to send as param for handling the request
     */
    getParameter : function() {
        return this._param;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
```

## Request handler

Request handlers are handled by Oskari core and any custom handlers need to be registered there through sandbox to have any effect. Any request can have only one handler, but a handler can handle many requests. Currently the core doesn't check if you are trying to register a second handler to a request and results can be unexpected. You should prefix the request name with your bundle identifier to make the name unique.

To register a ReguestHandler to handle a given request:

```javascript
var reqHandler = Oskari.clazz.create('Oskari.<mynamespace>.bundle.<mybundle>.request.MyRequestHandler', <any params for constructor (optional if you dont need any)>);
sandbox.addRequestHandler('<Request name>', reqHandler);
```

You can remove the handler by calling (usually in stop method):

```javascript
sandbox.removeRequestHandler('<Request name>', reqHandler);
```

### Sample request handler definition

```javascript
/**
 * @class Oskari.<mynamespace>.bundle.<mybundle>.request.MyRequestHandler
 * Handles Oskari.<mynamespace>.bundle.<mybundle>.request.MyRequest
 */
Oskari.clazz.define('Oskari.<mynamespace>.bundle.<mybundle>.request.MyRequestHandler', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.<mynamespace>.bundle.<mybundle>.MyBundleInstance} instance
 *          reference to instance so we can call its methods, param depends on what you need to handle the request
 */
function(instance) {
    this._instance = instance;
}, {
    /**
     * Protocol method that is called when a request this handler is registered to is received by core.
     *
     * @method handleRequest 
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.<mynamespace>.bundle.<mybundle>.request.MyRequest} request
     *      request to handle
     */
    handleRequest : function(core, request) {
        var sandbox = core.getSandbox();
        // you dont need to check this if you are just handling one request,
        // but you can register handler for multiple requests too
        if(request.getName() == '<mybundle>.MyRequest') {
            this._handleMyRequest(sandbox, request);
        }
    },
    _handleMyRequest : function(sandbox, request) {
        // handle the request
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
```