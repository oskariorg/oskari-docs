# Configuring map projection

In Oskari application it is possible to configure a different map projection for every view. The map projection can be configured in mapfull bundle configuration. Mapfull bundle configuration can be found in the database table *portti_view_bundle_seq* in column *config* where *bundle_instance* is mapfull. If there are many views in the database, there are also many mapfull configurations.

The next is an example of a mapfull configuration where the map projection is configured to be EPSG:3057

```sql
    {  
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
```

Important parts in the previous lines regarding map projection are **mapOptions** and **projectionDefs**.

In **mapOptions** there is first maxExtent, which means projected bounds of the chosen projection. The bounds can be found f. e. in [spatial reference web site](http://spatialreference.org/ref/epsg/isn93-lambert-1993/).
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