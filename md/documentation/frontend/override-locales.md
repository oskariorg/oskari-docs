# Overriding Oskari.org bundle locales

This documents helps to create bundle which overrides default Oskari.org locales.

# How to create locale override?

## Call Oskari.registerLocalization 

Create new bundle-package under Oskari/packages/mynamespace/bundleid/bundle.js which links
overriding localization files:

```javascript
Oskari.clazz.define("Oskari.mynamespace.bundleid.Bundle", function() {
}, {
    "create" : function() {
        return this;
    },
    "update" : function(manager, bundle, bi, info) { },
    "start": function() {},
    "stop": function() {}
}, {
    "protocol" : [],
    "source" : {
        "scripts" : [],
        "locales" : [
            {
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/mynamespace/bundleid/resources/locale/fi.js"
            },
            {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/mynamespace/bundleid/resources/locale/en.js"
            }
        ]
    }
});
Oskari.bundle_manager.installBundleClass("lang-overrides", "Oskari.mynamespace.bundleid.Bundle");
```

You don't need to copy-paste the whole localization files and can just define new values for the keys that you wish to change.
An example file that could be `Oskari/bundles/mynamespace/bundleid/resources/locale/en.js`:

```javascript
Oskari.registerLocalization(
{
    "key": "MapModule",
    "value": {
        "plugin": { 
            "LogoPlugin" : { 
                "dataSources": "Copyright",
                "layersHeader": "&copy; ELF and listed service providers"
            }
        } 
    }, 
    "lang": "en"
}, true);
```

Notice the second parameter for the registerLocalization() function call.
This indicates that the values are overrides (value is true).

`First parameter` is a a normal localization object as seen on normal bundles, but you can choose to include only the values
you wish to override. In Object must be a following keys and their values: key, value and lang.
`Second parameter` is a Boolean that indicates overriding localization (value is true).

Also notice that you can have several Oskari.registerLocalization() calls in the same file if you need to override more than
one localization.

## Change application startup sequence

Timing is critical with the overrides. The overriding bundle must be started before the actual bundles start using their locales.
If a bundle has already read the value and created it's UI before the override is done, the bundle doesn't know the value has changed.
Therefore the best place to start your overrides is as the first bundle to be started. This means
placing it first in startupSequence and minifierAppsetup.json.

# Example bundle

You can use [this bundle](https://github.com/nls-oskari/oskari/blob/develop/packages/elf/bundle/elf-lang-overrides/bundle.js) as an example.

