# Oskari application

Applications are defined by starting one or more [bundles](/documentation/core-concepts/oskari-bundle). The collection of bundles provide the functionalities that are needed in a particular application. Bundles are defined as individual components and referenced in an applications startup sequence to tie them together to a complete application. Oskari provides a way of giving configuration properties for bundles on application startup. This is how e.g. the map is moved to a given location and zoom level on startup and layers are preselected. See more from [configuration](/documentation/core-concepts/oskari-bundle-configuration).

Application is started by calling:

```javascript
var app = Oskari.app,
    appSetupConfig = {
        startupSequence : [...<bundle references>...],
        "configuration" : {
          "mapfull" : {
              "conf": {...<configuration for bundle mapfull>...}
              "state" : {...<state for bundle mapfull>...}
          }
        }
    };
    
app.setApplicationSetup(appSetupConfig);
app.setConfiguration(appSetupConfig.configuration);
app.startApplication(function() {
    alert('all bundles loaded');
});
```

* `setApplicationSetup` takes a parameter object that has `startupSequence` property. `startupSequence` is an array of referenced bundles to be loaded in given order on application startup.
* `setConfiguration` takes a parameter object that has properties matching `<bundle-identifiers>`. Loader sets these properties as members to the matching bundle instance.
* `startApplication` - takes a callback as parameter. The callback function is called when all bundles has been loaded and is given information about the loaded bundles as parameter.

## Startup sequence

Oskari loader processes the startup sequence in declared order to implement a simplified dependency resolver.

**A typical startup sequence for Oskari web mapping apps:**

1. OpenLayers bundle (a bundle providing a version of OpenLayers)
2. Main Map with Framework bundles
3. Oskari DIV Manazer to support Tiles and Flyouts based User interface
4. Any Extension Bundles

```javascript
{
    startupSequence: [
        <openlayers, see below>,
        <map, see below>,
        <oskari div manager, see below> ,
        <extensions, see below>
    ]
}
```

### 1. OpenLayers Bundle

This JSON loads and prepares OpenLayers. Also instantiates and starts OpenLayers theming (which initialises CSS and image paths for OpenLayers). It's usually first bundle to load since it's a dependency for the map.

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

### 2. Main Map with Framework Bundles

This JSON:

* loads any required Oskari Map framework bundles and Oskari core files from sources
* loads main map bundle for this application
* instantiates and starts main map bundle which creates and initialises the map for the framework
* After this the application is ready to support any map operations, add/remove layers of various kinds etc. The dependencies here can be altered to fit your needs. For example if you don't need WFS or WMTS support you can remove `mapwfs` and `mapwmts` from the imports.

```json
{
  "bundlename" : "mapfull",
  "metadata" : {
    "Import-Bundle" : {
      "core-base" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "core-map" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "sandbox-base" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "sandbox-map" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "event-base" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "event-map" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "event-map-layer" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "request-base" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "request-map" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "request-map-layer" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "service-base" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "service-map" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "common" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "domain" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "runtime" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "mapmodule-plugin" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "mapwfs" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "mapwmts" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      },
      "mapfull" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      }
    }
  }
}
```

### 3. Oskari DIV Manager

This JSON loads and prepares Oskari DIV Manager. Oskari DIV Manager extends the application providing support for Tile and Flyout based User Interface. After this the application supports Extensions.

```json
{
  "bundlename" : "divmanazer",
  "metadata" : {
    "Import-Bundle" : {
      "divmanazer" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      }
    }
  }
}
```

### 4. Extensions

One or more Bundles that uses Tiles and Flyouts can be now started since Oskari DIV Manager is available at this stage. A Bundle instance *may* register as Extension to the Oskari DIV Manager when started (notifying it has Tile and/or Flyout content that the bundle wants to have on the UI).

```json
{
  "bundlename" : "layerselection2",
  "metadata" : {
    "Import-Bundle" : {
      "layerselection2" : {
        "bundlePath" : "/<path to>/packages/framework/bundle/"
      }
    }
  }
}
```