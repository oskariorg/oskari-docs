# Oskari bundle configuration

When Bundles are created Oskari Loader sets configuration properties on them if available. Configurations are matched using the `<bundle-identifier>` and any properties defined are set as properties on the instances. Like the example below, `mapfull` instance will have `conf` and `state` properties available when it fires up:

```json
{
   "mapfull": {
      "state": {
         "selectedLayers": [{
            "id": "base_35"
         }],
         "zoom": 1,
         "north": "6874042",
         "east": "517620"
      },
      "conf": {
         "globalMapAjaxUrl": "/ajax?",
         "plugins": [
            {
               "id": "Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin"
            },
            {
               "id": "Oskari.mapframework.mapmodule.WmsLayerPlugin"
            },
            {
               "id": "Oskari.mapframework.mapmodule.ControlsPlugin"
            },
            {
               "id": "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"
            },
            {
               "id": "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar"
            }
         ],
         "layers": [
            "...layers as JSON objects..."
         ],
         "imageLocation": "/Oskari/resources"
      }
   }
}
```

The `conf` and `state` properties are used throughout Oskari bundles to setup the application. Their contents can be anything that the bundle requires. The conf property should be used to relay information about the runtime environment and state is used to set the bundles initial values for things that are likely to change at runtime.