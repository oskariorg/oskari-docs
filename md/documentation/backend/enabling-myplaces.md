# Enabling My Places With Postgis

**NOTE!** This document describes setup with [GeoServer](http://geoserver.org/). In case you have a different WMS service installed, adjust accordingly.

## Assumes pre-installed:

* JDK 1.6+ (tested with 1.6.18)
* Maven 3+ (tested with 3.0.5)
* [database available](/documentation/backend/database-create)
* existing [server](/documentation/backend/server-configuration-jetty)
* existing [development environment](/documentation/backend/server-embedded-developer)

## Configuration

### Create a view

[Create a new view](/documentation/backend/database-populate#adding-a-new-view) with `myplaces2` and `mapwfs2` bundles (edit the view to match your environment and remove the config for `myplaces2` if you prefer to cofigure using properties file instead):

    cd oskari-server/content-resources
    mvn clean install exec:java -Doskari.addview=postgres-myplaces2-view
	
***NOTE!*** *To get myplaces timestamps working correctly you need to add triggers to myplaces table. SQLs for these are listed in `oskari-server/content-resources/src/main/resouces/sql/PostgreSQL/trigger-myplaces.sql`. You need to run these manually in psql or pgAdmin SQL window since at the moment the sql parser can't handle them correctly.*

### Install GeoServer

*Tested with version 2.4.3*

Download [GeoServer](http://geoserver.org/).

Use unique port for GeoServer e.g. 8082 (not equal to the Jetty port where `oskari-server` is running). If GeoServer is already available take a look at the guidelines below.

Replace GeoServer data directory, add `OskariMarkFactory` extension and start GeoServer:

* Replace `{geoserver}\data_dir` with `oskari-server\content-resources\config\geoserver\data`
* Add GeoServer symbolizer extension `oskari-server/geoserver-ext/OskariMarkFactory/target/OskariMarkFactory-1.0.jar` to `{geoserver}\webapps\WEB-INF\lib` (see `oskari-server\geoserver-ext\OskariMarkFactory\readme.txt`)
* Start GeoServer (e.g. `{geoserver}\bin\startup`)
* Check data configuration with GeoServer admin interface: http://localhost:8082/geoserver/web -> layer preview -> layers: `my_places` and `my_places_categories` (these are empty in the initial state)
* If there are problems in layer preview, check workspace and store setups with GeoServer admin interface (see guidelines below).
* Restart GeoServer

### Configure properties

Check settings in `{jetty}/resources/oskari-ext.properties` and uncomment or add the following settings and set them point to your geoserver url:

    # Add 'myplacestile' to proxy services
    oskari.proxyservices = myplacestile [, ...]

	oskari.proxy.myplacestile.url=http://localhost:8082/geoserver/wms?CQL_FILTER=
	oskari.proxy.myplacestile.handler=fi.nls.oskari.proxy.MyPlacesProxyHandler 
	oskari.proxy.myplacestile.user=admin
	oskari.proxy.myplacestile.pass=geoserver

	myplaces.ows.url=http://localhost:8082/geoserver/oskari/ows?
	myplaces.wms.url=http://localhost:8082/geoserver/oskari/wms?buffer=128&tiled=yes&tilesorigin=0,0&CQL_FILTER=
	myplaces.user=admin
	myplaces.password=geoserver
	# Base WFS layer id for myplaces (from portti_maplayer table)
	# Find the correct layer id from the database or create a myplaces layer if not found
    myplaces.baselayer.id=14
    # My places namespace
    myplaces.xmlns=http://www.oskari.org
    # My places namespace prefix
    myplaces.xmlns.prefix=oskari

The config for `myplaces2` bundle gets generated from the properties above. You can always override them by writing to the config of `myplaces2` in `portti_view_bundle_seq`.

    # This always comes from the properties:
    queryUrl : <oskari.ajax.url.prefix> + 'action_route=MyPlaces'

    # Default if not defined: <oskari.ajax.url.prefix> + 'action_route=MyPlacesTile&myCat='
    wmsUrl : <myplaces.client.wmsurl>

    # Default if not defined: 'http://www.oskari.org'
    featureNS : <myplaces.xmlns>

    # Default if not defined: 'oskari:my_places_categories'
    layerDefaults.wmsName : <myplaces.xmlns.prefix> + ':my_places_categories'


### Install WFS transport service

Look at [setting up transport wfs service](/documentation/backend/installing-transport) (*skip this if already installed*).

### Test Oskari

Start e.g. http://localhost:8888/oskari-map?viewId={id} in your browser. Replace `{id}` with the id of the view you created. Logged in users should be able to add own points, lines and polygons.

## Troubleshooting

If there are troubles to add myplaces you should check that `featureNS` (default namespace should be *http://www.oskari.org* with prefix *oskari*) and ajax url are correct according to your environment. `wmsUrl` should be normal ajax url (default is `/?` or `/oskari-map/?`) + `action_route=MyPlacesTile&myCat=`. The easiest way to verify these are correct is to check what gets returned to the browser from `GetAppSetup`.

If you need to correct some of these settings, do one of the following:

* edit the properties in `oskari-ext.properties`
* edit `postgres-myplaces2-view.json` and recreate the view
* use psql or pgAdmin and run the following sql:
```sql
UPDATE portti_view_bundle_seq SET config='{
    "queryUrl" : "[REPLACED BY HANDLER]",
    "wmsUrl" : "/oskari-map/?action_route=MyPlacesTile&myCat=",
    "featureNS" : "http://www.oskari.org",
    "layerDefaults" : {
        "wmsName" : "oskari:my_places_categories"
    },
}' 
WHERE bundle_id=(SELECT id FROM portti_bundle WHERE name='myplaces2') AND view_id={the id of the view you created};
```
  
You may also need to change `oskari-server/service-map/src/main/resources/fi/nls/oskari/map/myplaces/service/GetFeatureInfoMyPlaces.xsl` to fix your geoserver url and namespace.

## Guidelines for GeoServer configuration

Open GeoServer admin interface (e.g. http://localhost:8082/geoserver, default credentials: admin/geoserver).

### Create a workspace

Create a new workspace *oskari* . Set it as default and enable WFS and WMS services. Set namespace URI to e.g. http://www.oskari.org.

### Create a store

Add your database as a new postgis store:

* Store -> Add new Store -> PostGIS
* Select *oskari* as workspace and name the data source "my_places_categories" 
* Check it as enabled
* Set the connection parameters, for example: 
    * host: localhost, port: 5432
    * database: oskaridb, schema: public
    * user: *username*, passwd: *password* (sample default postgres/postgres)

### Create a style


You can create your own style choosing Styles and modifying existing style or uploading a new style file.

You can find an example file at `oskari-server/docs/example-server-conf/MyPlacesSampleStyle.sld`

### Add layers

Add layers `categories`, `my_places`, and `my_places_gategories`

* Layers -> Add a new resource -> Add layer from "ows:my_places_categories"
* Publish `categories` (no geometry field):
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Native bbox (50 000, 6400000, 800000, 8000000)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Publishing -> Set Default Style (e.g. "MyPlacesSampleStyle")
    * Save
* Publish `my_places`:
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Native bbox (50 000, 6400000, 800000, 8000000)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Publishing -> Set Default Style (e.g. "MyPlacesSampleStyle")
    * Save
* Publish `my_places_categories`:
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Publishing -> Set Default Style (e.g. "MyPlacesSampleStyle")
    * Save

### Add a security rule

Add read access to everyone and write access to authenticated role.

### Setup cache

Select `oskari:my_places_categories` layer -> tile caching setup:

* Create a cached layer for this layer (use default values)
* Set gutter size in pixels to 100
