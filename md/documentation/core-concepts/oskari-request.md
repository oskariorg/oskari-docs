# Request

*List of all Oskari requests can be found [here](/api/requests).*

`Requests` are used by bundles to ask another component in an Oskari application to do something. One `request` requests always a specific functionality to be accomplished and there is only one bundle reacting to a specific `request`. However, any bundle can send a `request` to request that specific functionality. Bundles may/should send predetermined parameters with the `request`. Below is an image demonstrating the use of a `request`:

<img src="/images/documentation/requests/request_example.PNG" alt="Oskari mobile mode published" height="450"/>

`Requests` should be used to ask another bundle to carry out some **bigger** task based on the information got with the `request`. They should NOT be used to e.g. ask the state of bundle or transmit a request inside a bundle.

`Requests` are **one-way** so the possible information about success or failure should be informed with events or callbacks.

More detailed image about bundles sending requests and events can be found [here](/documentation/development/architecture) under Bundle communication.

## Using requests

To be able to use a request the bundle registering and handling the request should be included in your application setup.

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

If a request builder is returned, it's safe to assume that the bundle handling the request is part of the application setup. If the request handler has not been registered, the `sandbox#getRequestBuilder` returns `undefined`. Guidelines rule that files defining requests and requesthandlers are located under a request folder under the bundle implementation.

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

## Creating own requests

For creating and using own request you need three components:

- request defined in one js-file
- requesthandlers defined and registered by a bundle
- request sent by a bundle (described above)

### Request definition

Request should be defined in one js-file under requests-folder under the registering bundle. Below is a sample definition of a request:

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

### Request handler

Request handler should be registered by a bundle who is responsible for performing the request. Request handlers are handled by Oskari core and any custom handlers need to be registered there through sandbox to have any effect. Any request can have only one handler, but a handler can handle many requests. Currently the core doesn't check if you are trying to register a second handler to a request and results can be unexpected. You should prefix the request name with your bundle identifier to make the name unique.

To register a ReguestHandler to handle a given request:

```javascript
var reqHandler = Oskari.clazz.create('Oskari.<mynamespace>.bundle.<mybundle>.request.MyRequestHandler', <any params for constructor (optional if you dont need any)>);
sandbox.addRequestHandler('<Request name>', reqHandler);
```

You can remove the handler by calling (usually in stop method):

```javascript
sandbox.removeRequestHandler('<Request name>', reqHandler);
```
Request handler should also be defined in one js-file, preferably under requests-folder. Below is a sample request handler definition:

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
