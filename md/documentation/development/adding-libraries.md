# Adding 3rd party JavaScript libraries

* Add library files under `Oskari/libraries/<yourLibrary>/`

* If your library is just for your own bundle
    * reference library files in your `bundle.js`

* If your library is for several bundles
    * create a new `bundle.js` under `Oskari/packages/libraries/<yourLibrary>/`
    * include this new "library bundle" in the startup sequence of your bundle

Example of library `bundle.js`:

```javascript
(function() {
    /**
     * @class Oskari.libraries.bundle.geostats.GeostatsBundle
     */
    Oskari.clazz.define("Oskari.libraries.bundle.geostats.GeostatsBundle", function() {
    }, {
        "create" : function() {
            return this;
        },
        "update" : function(manager, bundle, bi, info) {},
        "start" : function() {},
        "stop" : function() {}
    }, {
        "protocol" : ["Oskari.bundle.Bundle","Oskari.bundle.BundleInstance"],
        "source" : {
            "scripts" : [{
                "type" : "text/javascript",
                "src" : "../../../../libraries/geostats/geostats.min.js"
            },
            {
                "type" : "text/javascript",
                "src" : "../../../../libraries/geostats/jenks.util.js"
            }]
        }
    });
     
    // Install this bundle by instantating the Bundle Class
    Oskari.bundle_manager.installBundleClass("geostats", "Oskari.libraries.bundle.geostats.GeostatsBundle");
})();
```