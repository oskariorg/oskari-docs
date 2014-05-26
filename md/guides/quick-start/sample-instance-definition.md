# Sample definition for a bundle instance file

The `instance.js` file is usually responsible for creating all the classes a bundle might need during its lifetime, registering possible request handlers and registering the bundle to the sandbox to be able to listen to events.

By extending `DefaultExtension` you can forget the nitty gritty details and can focus on writing the application logic instead. All the functions can be overridden though should you need to do something differently (in the example below, we override the `getName` function as it returns the name from config by default). Refer to the [API documentation](/api/latest/) to see all the functions of `DefaultExtension`.

***NOTE!*** *Function `afterStart` was added in version* ***1.21.***

```javascript
/**
 * This bundle logs the map click coordinates to the console. This is a demonstration of using DefaultExtension.
 *
 * @class Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundleInstance
 */
Oskari.clazz.define('Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundleInstance',
/**
 * @method create called automatically on construction
 * @static
 */
function () {
    // Best practice is to initialize instance variables here.
    this.myVar = undefined;
}, {
    /**
     * @static
     * @property __name
     */
    __name : '<my-bundle-name>',
    /**
     * Module protocol method
     *
     * @method getName
     */
    getName : function () {
        return this.__name;
    },
    eventHandlers: {
        'MapClickedEvent': function (event) {
            console.log('Map clicked at', event.getLonLat());
        }
    },
    /**
     * DefaultExtension method for doing stuff after the bundle has started.
     * 
     * @method afterStart
     */
    afterStart: function (sandbox) {
        console.log('Bundle', this.getName(), 'started');
        this.myVar = 'foobar';
    }
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});

```

If you're using version 1.20 or below, replace the `afterStart` function with following:

```javascript
start: function () {
    var conf = this.conf,
        sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
        sandbox = Oskari.getSandbox(sandboxName),
        request;

    this.sandbox = sandbox;
    /* Register to sandbox in order to be able to listen to events */
    sandbox.register(this);

    /* Register as stateful if configured so */
    if (conf && conf.stateful === true) {
        sandbox.registerAsStateful(this.mediator.bundleId, this);
    }

    /* Add extensions (Tile, Flyout, View). */
    /* Localization should have keys 'tile', 'flyout' and 'view' to start these, respectively. */
    /* Missing key means no extension for you. */
    request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');
    sandbox.request(this, request(this));

    /* Necessities done, let's get to business */
    console.log('Bundle', this.getName(), 'started');
    this.myVar = 'foobar';
}
```
