# Map

The default map functionality is implemented in bundle `mapmodule` under `oskari-frontend/bundles/mapping/mapmodule`. Default implementation is based on OpenLayers Map, but the idea of having a map module wrapping the actual implementation library is having an API that other bundles can use for map operations without tightly coupling the code to specific map engines. This allows most of the code work out-of-the-box with the map engine library changed.

## Map plugins

The map module provides extension hooks for application by providing a [plugin mechanism](/documentation/features/map/mapplugin).

The plugins can either:
- add functionality to map that can then be used by other functionality programmatically (like drawing tools)
- add support for different types of map layers (some are included by default like plugins for OGC standards WMS, WMTS, WFS etc)
- add controls for the user to click on the map that interact with the map somehow

The `publisher` functionality in Oskari also works best out-of-the-box on the user selecting functionalities on the map when the functionalities are provided by map plugins.

## Usage of plugins with map module

1) Get reference to mapmodule

```javascript
// Find mapmodule using sandbox or a stored reference depending on your coding style
const mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
```

2) Instantiate plugin

```javascript
const myPlugin = Oskari.clazz.create('Oskari.mapmodule.plugin.MyPlugin', {
    configOption: 'foo'
});
```

3) Register Plugin

```javascript
mapmodule.registerPlugin(myPlugin);
```

4) Start Plugin

```javascript
mapmodule.startPlugin(myPlugin);
```

Note: starting manually is not needed if the plugin is registered before map module is started, but usually extension plugins are added after the map has been started.

The other lifecycle functions for shutting down the functionality are:

5) Unregister Plugin

```javascript
mapmodule.unregisterPlugin(myPlugin);
```

6) Stop Plugin

```javascript
mapmodule.stopPlugin(myPlugin);
```
