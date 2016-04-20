# Bundle Manager / loader

* loads Bundle Definitions
* manages bundle state and lifecycle
* loads Bundle JavaScript sources and CSS resources
* instantiates Bundle Instances
* manages Bundle Instance lifecycle

## Oskari loader

Oskari loader is part of Oskari core functionality. The loader takes in a JSON-array describing bundles that need to be loaded, started and configured:

    var bundleSequence = [];
    var applicationConfig = {};
    var loader = Oskari.loader(bundleSequence, applicationConfig);
    loader.processSequence(function() {
        // all done
    });

The loader determines any JavaScript that must be loaded for a bundle, loads the scripts and resources that aren't already loaded and creates an instance of that bundle. The bundle/startup sequence for the loader needs JSON-objects like this:

```json
{
  "bundlename" : "openlayers-default-theme",
  "metadata" : {
    "Import-Bundle" : {
      "openlayers-single-full" : {
        "bundlePath" : "/<path to>/packages/openlayers/bundle/"
      },
      "openlayers-default-theme" : {
        "bundlePath" : "/<path to>/packages/openlayers/bundle/"
      }
    }
  }
}
```
Where:
- bundlename is the name of the bundle that we want to start
- metadata["Import-Bundle"] describes and bundles that need to be loaded and basepaths for them. Atleast the bundle that is referenced in bundlename should be present here, but it can also reference other bundles. The other bundles aren't started, but the scripts and resources they provide are loaded to the browser (think libraries).
- bundleinstancename is an optional key that can be used to reference a specific bundle configuration. This is useful if you want to start the same bundle multiple times with different configurations.

### Processing the bundle sequence block

#### 1) The loader goes through each key in Import-Bundle object

It tries to load a file named bundle.js from path constructed from `[bundlePath]/[bundleid]/bundle.js`. Where bundlePath above would be `/<path to>/packages/openlayers/bundle/`, bundleid would be `openlayers-single-full` and `openlayers-default-theme`. These are loaded one after each other, the loading order of any `Import-Bundle` reference is not guaranteed.

When the bundle.js is loaded, it's expected to call a global function and provide a bundleid and an Oskari class name that describes the scripts and resources for such bundle:

    Oskari.bundle_manager.installBundleClass("[bundle id]", "[class name like Oskari.framework.MyBundle]");

This registers the bundle so Oskari is aware of it and can start it. You can check that a bundle has been registered by calling `Oskari.bundle('[bundle id]');`

Note! If Oskari is already aware of the bundles to be loaded (installBundleClass has been called on them) the loader assumes the bundle to be loaded and moves to step 3 to start the bundle.

#### 2) Script/resource loading

Any bundle referenced in `Import-Bundle` should have called the installBundleClass-function to register itself with the bundle id. The loader tries to create an descriptor instances for the referenced bundles using `Oskari.clazz.create([class name])` where the class name is referenced in the installBundleClass call. The created class lists all the scripts, resources, locale files that are part of the bundle. This information is used to load the files implementing the bundle to the browser. Once again at this point the files are expected to work with global context (mainly referencing Oskari.clazz.define()).

The bundle descriptor system is something that could be improved in the future. The bundle definition could be described as JSON that is interpreted on the loader instead of using a class with the bundle register through a global Oskari.

#### 3) Starting the bundle

After all the imports have been handled the loader tries to find a registered bundle for the bundle id that is marked with `bundlename`. If the installBundleClass call has been made, the loader fetches the bundle descriptor instance of the referenced bundle. The loader then calls a `create()` function on the descriptor class. The create call should return an instance of the main access point of that bundle.

#### 4) Bundle instance configuration

The loader tries to find a block named after the bundle on the configuration given in the start. If bundleinstancename is given, the configuration is located using it. If the block is present, anything under the block will be made available as properties in the bundle instances main access point. Usually the configuration has keys named conf and state, but it could have also others or nothing at all. Conf is used to communicate settings that are not changed during runtime like the map projection or zoom levels. State is used for settings that can change on runtime like the current location or zoom level that the map is in.

After the configuration has been injected the loader hands over the execution to the bundle instance by calling its `start()` function. The start() function works as the main entrypoint and the bundle handles what happens on/after that call.

#### 5) Repeat

After this the loader moves to the next block in startup sequence and after the whole sequence has been processed it calls the optional "done"-callback that was given to the initial processSequence() call.

## Manually starting bundles

You can also manually start bundles by calling:

    Oskari.app.playBundle({
        "bundlename" : "coordinatetool",
        "metadata" : {
            "Import-Bundle": {
                "coordinatetool": {
                    "bundlePath": "/Oskari/packages/framework/bundle/"
                }
            }
        }
    });

This loads the bundle implementation to the browser as it would have been in the startup sequence and starts it.

If you need to give the bundle a config and know when it has been started you can give the config as second parameter and a callback function as third:

    Oskari.app.playBundle({
        "bundlename" : "coordinatetool",
        "metadata" : {
            "Import-Bundle": {
                "coordinatetool": {
                    "bundlePath": "/Oskari/packages/framework/bundle/"
                }
            }
        }
    }, {
        conf : {
            isReverseGeocode : true,
            reverseGeocodingIds : "WHAT3WORDS_CHANNEL"
        }
    },
    function() {
        console.log('Bundle started');
    });

You can also give the callback function as the second parameter to playBundle() function.