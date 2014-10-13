# Thematic maps setup

***NOTE! The thematic map mode is still in beta stage and will be revised along with this document.***

Thematic map mode displays statistical indicators in a grid and on the map for visualization. The [bundle doc](/documentation/bundles/statistics/statsgrid) for `statsgrid` (the implementing bundle) might also be worth a read (it has a nice screen shot too!).

**Current limitations:**

* Only [SOTKAnet](http://uusi.sotkanet.fi/portal/page/portal/etusivu) indicators supported (option to add multiple data sources is in the works)
* Getting the thematic map tiles is rather complicated at the moment. Will be simplified in the future

### Assumes pre-installed

* `oskaridb` database set up
* Geoserver or other WMS service accessible
* Oskari server running
* Oskari frontend code served by a web server

### 1. Add the necessary bundles to the app setup

Create a view with the following included in the view json. You can use one of the existing views as a basis. Please refer [here](/documentation/backend/database-populate) for advice on how to add views.

* `mapstats` bundle should be imported by `mapfull`. Add this to the `Import-Bundle` section of `mapfull`'s `startup`:
```json
"mapstats" : {
    "bundlePath" : "/Oskari/packages/framework/bundle/"
}
```
* `Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin` should be defined in the `plugins` array of `mapfull`'s `config`:
```json
{ "id" : "Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin" }
```
* Make sure the `statsgrid` bundle is added to the `portti_bundle` table and include `statsgrid` bundle in the `bundles` array:
```json
{
    "id" : "statsgrid",
    "config" : {
        "name" : "StatsGrid",
        "sandbox" : "sandbox",
        "stateful" : true,
        "tileClazz" : "Oskari.statistics.bundle.statsgrid.Tile",
        "viewClazz" : "Oskari.statistics.bundle.statsgrid.StatsView"
    }
}
```

### 2. Add the stats layer to the database

Run the sql found in `oskari-server/content-resources/src/main/resources/sql/layers/statlayer_example.sql` if you do not already have a layer of type `statslayer` in your database. Replace the empty `url` with a reference to your WMS service url. The script assumes you have a layer in namespace `ows` called `kunnat2013` added to your WMS service. You might want to replace that as well.

Add the [view rights](/documentation/backend/permissions) to the layer.

### 3. Configure the service urls

Add the following properties to `oskari-ext.properties` file:

* Base url for the SOTKAnet API
        sotka.baseurl=http://www.sotkanet.fi/rest
* url to the WMS service and the credentials
        statistics.geoserver.wms.url=
        statistics.user=
        statistics.password=
* url to the server providing the SLD and the path to get the SLD from the server (the latter is optional. If not defined, it uses the ajax url instead). This server needs to be accessible from the WMS service
        statistics.sld.server=
        statistics.sld.server.path=
