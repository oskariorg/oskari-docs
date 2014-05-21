# Map plugin

Map View Plugins are used to add required functionality to the map view without editing the framework using a consistent pattern. Map Module plugins may be distributed within bundles and registered as bundle is instantiated. The default Map View is implemented in bundle `mapmodule-plugin`. Default implementation is based on OpenLayers Map. Some OpenLayers specific code is spread across sources but there's been an attempt to isolate OpenLayers specific code to enable switching to 'the best map framework' in the future. Plugin provides access to OpenLayers Map primitives.

[Map Module Plugin Protocol (interface)](https://github.com/nls-oskari/oskari/blob/master/bundles/framework/bundle/mapmodule-plugin/plugin/Plugin.js)


## Registering and starting a Plugin

### Example 1: WMTS layer plugin

WMTS layer plugin is used to add WMTS layers to the map.

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

After this the plugin is usable and its methods can be called and events can be listened to.

### Example 2: draw plugin

Draw plugin can be used to enable drawing of different types of features on the map. The plugin sends various events in different phases of the draw.

    // get reference to mapmodule
    var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
     
    // create drawplugin with conf (id should be used if we have multiple drawplugins, defaults to "DrawPlugin")
    var pluginConfig = {
        id: 'Something',
        multipart: true
    };
    var drawPlugin = Oskari.clazz.create('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', pluginConfig);
    // register drawplugin for map
    mapModule.registerPlugin(drawPlugin);
    mapModule.startPlugin(drawPlugin);
     
     
    drawPlugin.startDrawing({ drawMode : 'point' }); // or 'line' or 'area'
     
    // clicks ..  on ... map
    // double click to end drawing or programmatically call "drawPlugin.forceFinishDraw();"
     
    // will result in "DrawPlugin.FinishedDrawingEvent" being sent. Listen to it and: 
    eventHandlers : {
        "DrawPlugin.FinishedDrawingEvent" : function (event) {
            // preferred to use sandbox.printDebug()
             console.log("User drew:", event.getDrawing());
        }
    }
