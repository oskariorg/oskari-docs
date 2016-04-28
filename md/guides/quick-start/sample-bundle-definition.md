# Sample definition for a bundle

A file named `bundle.js` under `/packages/<mynamespace>/bundle/<bundle-identifier>/` folder should contain this sort of content. It defines that the bundles implementation file `instance.js` is located under `/bundles/mynamespace/bundle/<bundle-identifier>/` and localization data under that in `locale/<lang>.js` files. At the end it installs the bundle to the Oskari framework so it can be started by the Oskari loader. Change the `<bundle-identifier>` and `<mynamespace>` to the identifiers of your choice before actually using this sample template.

```javascript
/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundle
 */
Oskari.clazz.define("Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundle",

/**
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 *
 * @contructor
 * @static
 */
function() {

}, {
    /*
     * called when a bundle instance will be created
     *
     * @method create
     */
    "create" : function() {
        return Oskari.clazz.create("Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundleInstance");
    },
    /**
     * Called by Bundle Manager to provide state information to
     *
     * @method update
     * bundle
     */
    "update" : function(manager, bundle, bi, info) {
    }
},

/**
 * metadata
 */
{
    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {
        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/<mynamespace>/bundle/<bundle-identifier>/instance.js"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/<mynamespace>/bundle/<bundle-identifier>/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/<mynamespace>/bundle/<bundle-identifier>/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/<mynamespace>/bundle/<bundle-identifier>/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "<bundle-identifier>",
            "Bundle-Name" : "<bundle-identifier>",
            "Bundle-Author" : [{
                "Name" : "ev",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2009",
                    "End" : "2011"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale" : {
                "fi" : {
                    "Name" : " style-1",
                    "Title" : " style-1"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : []
});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("<bundle-identifier>", "Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundle");
```
