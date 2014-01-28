# Map plugin

Map View Plugins are used to add required functionality to the map view without editing the framework using a consistent pattern. Map Module plugins may be distributed within bundles and registered as bundle is instantiated. The default Map View is implemented in bundle `mapmodule-plugin`. Default implementation is based on OpenLayers Map. Some OpenLayers specific code is spread across sources but there's been an attempt to isolate OpenLayers specific code to enable switching to 'the best map framework' in the future. Plugin provides access to OpenLayers Map primitives.

[Map Module Plugin Protocol (interface)](https://github.com/nls-oskari/oskari/blob/master/bundles/framework/bundle/mapmodule-plugin/plugin/Plugin.js)


## Registering and starting a Plugin

```javascript
// 1) Access MapModule
// Find mapmodule using sandbox or a stored reference depending on your coding style
var mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');

// 2) Instantiate plugin
var wmtsPlugin = Oskari.clazz.create('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin', {
    configOption: 'foo'
});

// 3) Register Plugin
mapmodule.registerPlugin(wmtsPlugin);

// 4) Start Plugin. Note: Shall be called AFTER mapmodule is started. Map module starts any registered plugins if those are registered before start.
mapmodule.startPlugin(wmtsPlugin);
```