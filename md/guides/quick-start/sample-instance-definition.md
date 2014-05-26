# Sample definition for a bundle instance file

The `instance.js` file is usually responsible for creating all the classes a bundle might need during its lifetime and also for registering the bundle to the sandbox to be able to listen to events.

```javascript
/**
 * This bundle demonstrates how bundle can react to events by 
 * registering itself to sandbox as a module.
 *
 * @class Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundleInstance
 */
Oskari.clazz.define('Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundleInstance',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = null;
    this.enabled = true;
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
    getName : function() {
        return this.__name;
    },
    /**
     * BundleInstance protocol method
     *
     * @method update
     */
    update : function() {},
    /**
     * BundleInstance protocol method
     *
     * @method start
     */
    start : function() {
        var conf = this.conf,
            sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox',
            sandbox = Oskari.getSandbox(sandboxName);

        this.sandbox = sandbox;
        // register to sandbox as a module
        sandbox.register(this);
    },
    /**
     * Module protocol method
     *
     * @method init
     */
    init : function() {
        // headless module so nothing to return
        return null;
    },
    /**
     * @static
     * @property eventHandlers
     */
    eventHandlers : {
        '<mynamespace>.MyEvent' : function (event) {
            // do something with the event
        }
    },
    /**
     * Module protocol method/Event dispatch
     *
     * @method onEvent
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if (handler) return handler.apply(this, [event]);
    },
    /**
     * BundleInstance protocol method
     *
     * @method stop
     */
    stop : function() {
        // unregister module from sandbox
        this.sandbox && this.sandbox.unregister(this);
    },
    /**
     * Convenience method to call from Tile and Flyout
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @method getLocalization
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key) {
        if (!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if (key) {
            return this._localization[key];
        }
        return this._localization;
    }
}, {
    protocol : [ 'Oskari.bundle.BundleInstance', 
                 'Oskari.mapframework.module.Module']
});
```
