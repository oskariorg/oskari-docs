# Configuring map projection

In Oskari application it is possible to configure different map projection for each view/appsetup. The map projection is configured for the mapfull bundle. Bundle configurations are in JSON-format that can be found in the database table *portti_view_bundle_seq* in column *config* where *bundle_id* matches the bundles id in portti_bundle table. If there are many views in the database, there are also many mapfull configurations. 

To get all the mapfull configurations from database run this script:

```sql
    SELECT view_id, config, state, startup FROM portti_view_bundle_seq where bundle_id IN (SELECT id FROM portti_bundle)
```
Select the view_id that matches the view you want to configure (default view/publish template propably) and get the 'config' for that row. The config includes functional configuration for the bundle which also includes for example which features to activate (plugins). The interesting part for projection configuration is the **mapOptions** and **projectionDefs** JSON-segments. These might not be present in the config in which case Oskari uses these defaults:

TODO: add defaults here

To configure the projection you must add or edit these JSON-segments. An example fragment for EPSG:3057 based map:

```json
    {  
        plugins : [ ....],
        ...,
        "mapOptions": {
           "maxExtent": {
              "left": -39925.6142,
              "bottom": -38980.4932,
              "right": 1001273.8754,
              "top": 986514.2978
           },
           "srsName": "EPSG:3057",
           "resolutions":[2048,1024,512,256,128,64,32,16,8,4,2,1,0.5,0.25]
        },
        "projectionDefs": {
           "EPSG:4326": "+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
           "EPSG:3057": "+proj=lcc +lat_1=64.25 +lat_2=65.75 +lat_0=65 +lon_0=-19 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
        }
    }
```

In **mapOptions** there is first maxExtent, which means projected bounds of the chosen projection. These are the bounds that the map engine will allow the user to pan the map. 
The bounds can be found f. e. in [spatial reference web site](http://spatialreference.org/ref/epsg/isn93-lambert-1993/).
Then there is srsName which is the name of the chosen projection.

<div class="bs-callout bs-callout-info">
    <h4>Configuring resolutions</h4>

    <p> In mapOptions it is also possible to give resolutions and units to the map. </p>
    <p> Resolutions are given as an array. If resolutions are not given, they are by default [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25]. </p>
    <p> Units are meters by default if not given in configuration. </p>
    <pre><code>
    {
        resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
        units : "m"
    }
    </code></pre>
</div>

In **projectionDefs** should be given [proj4js](http://proj4js.org/) configurations for all the projections that are going to be used in the application.

The projection can be configured to the database with the following kind of SQL. Remember to change the configuration to match your properties!

```sql
    UPDATE portti_view_bundle_seq
    set config = '{  
    "globalMapAjaxUrl": "[REPLACED BY HANDLER]",
    "plugins": [{
       "id": "Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin"
    }, {
       "id": "Oskari.mapframework.mapmodule.WmsLayerPlugin"
    }, {
       "id": "Oskari.mapframework.mapmodule.MarkersPlugin"
    }, {
       "id": "Oskari.mapframework.mapmodule.ControlsPlugin"
    }, {
       "id": "Oskari.mapframework.mapmodule.GetInfoPlugin",
       "config": {
          "ignoredLayerTypes": [
             "WFS",
             "MYPLACES"
          ]
       }
    }, {
       "id": "Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin"
    }, {
       "id": "Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin"
    }, {
       "id": "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"
    }, {
       "id": "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar"
    }, {
       "id": "Oskari.mapframework.bundle.mapmodule.plugin.PanButtons"
    }, {
       "id": "Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin"
    }, {
       "id": "Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin"
    }, {
       "id": "Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin"
    }, {
       "id": "Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin"
    }, {
       "id": "Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin"
    }, {
       "id": "Oskari.mapframework.mapmodule.VectorLayerPlugin"
    }],
    "layers": [

    ],
    "imageLocation": "/Oskari/resources",

    "mapOptions": {
       "maxExtent": {
          "left": -39925.6142,
          "bottom": -38980.4932,
          "right": 1001273.8754,
          "top": 986514.2978
       },
       "srsName": "EPSG:3057"
    },
    "projectionDefs": {
       "EPSG:4326": "+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
       "EPSG:3057": "+proj=lcc +lat_1=64.25 +lat_2=65.75 +lat_0=65 +lon_0=-19 +x_0=500000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
    }
    }
    ' 
    WHERE
    bundle_id = (SELECT id FROM portti_bundle WHERE name = 'mapfull')
    AND view_id = 4
```

# User-generated content

For user content like myplaces, analysis and userlayers one "native" projection is required for Geoserver config. 
The easiest way to do this is use the "setup" webapp provided in the Jetty Oskari package. 
TODO: jetty-package has the setup.war in {jetty.home} - add instructions.

# Printout 

TODO: printout configuration is a bit more involved.