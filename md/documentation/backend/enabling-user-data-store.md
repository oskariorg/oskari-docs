# Enabling User data store With Postgis

**NOTE!** This document describes setup with [GeoServer](http://geoserver.org/). In case you have a different WMS service installed, adjust accordingly.

## Assumes pre-installed:

* JDK 1.6+ (tested with 1.6.18)
* Maven 3+ (tested with 3.0.5)
* [database available](/documentation/backend/setup-database)
* existing [server](/documentation/backend/setup-jetty)
* existing [development environment](/documentation/backend/setup-development)
* configure myplaces and wfs support (http://oskari.org/documentation/backend/enabling-myplaces)

## Configuration

### Create user data tables to oskaridb database for kmz, shz (shp file set) file import storage

Use pgAdmin or psql to execute below SQL-script file

    \content-resources\src\main\resources\sql\PostgreSQL\create_userdata_tables.sql

### Add wfs base layer to oskari_maplayer table for userlayer featuredata management (transport)

Use pgAdmin or psql to execute below SQL-script file

    \content-resources\src\main\resources\sql\PostgreSQL\example-userlayer-wfs-baselayer.sql

Remember layer id of this new inserted layer for properties configuration

### Configure default view and bundle config for to add `myplacesimport` or create new view according to lastest Oskari documentation

    \content-resources\src\main\resources\sql\PostgreSQL\add_userlayer_to_default_view.sql

### Configure GeoServer

*Tested with version 2.4.3*

Download, if not [GeoServer](http://geoserver.org/).

Download, if not [WPS extension](http://sourceforge.net/projects/geoserver/files/GeoServer/2.4.3/extensions/geoserver-2.4.3-wps-plugin.zip/download)

* Download extension of equal version to GeoServer)
* copy jar files of .zip  to {geoserver}\webapps\geoserver\WEB-INF\lib


Use unique port for GeoServer e.g. 8082 (not equal to the Jetty port, where `oskari-server` is running). If GeoServer is already available take a look at the guidelines below.

Replace GeoServer data directory, add `OskariMarkFactory` extension and start GeoServer:

* Replace `{geoserver}\data_dir` with `oskari-server\content-resources\config\geoserver\data`
* Add GeoServer symbolizer extension `oskari-server/geoserver-ext/OskariMarkFactory/target/OskariMarkFactory-1.0.jar` to `{geoserver}\webapps\WEB-INF\lib` (see `oskari-server\geoserver-ext\OskariMarkFactory\readme.txt`)
* Add WPS Oskari extensions to GeoServer `(build modules (mvn clean install) under ..\oskari\oskari-server\geoserver-ext\wps and copy .jar files in target folders to {geoserver}\webapps\geoserver\WEB-INF\lib`
* Start GeoServer (e.g. `{geoserver}\bin\startup`)
* Check data configuration with GeoServer admin interface: http://localhost:8082/geoserver/web ( default credentials: admin/geoserver)
   -> layer preview -> layers:
   `user_layer` , `user_layer_data_style`  and `vuser_layer_data` (these are empty in the initial state)   (userdata layers)
* If there are problems in layer preview, check workspace and store setups with GeoServer admin interface (see guidelines below).
* Restart GeoServer

### Configure properties

Check settings in `{jetty}/resources/oskari-ext.properties` and uncomment or add the following settings and set them point to your geoserver url:

    ##############################################
    # DB connection parameters - fix url, user, pw
    ##############################################

    db.jndi.name=jdbc/OskariPool
    # Defines database driver used for Oskari content
    db.jndi.driverClassName=org.postgresql.Driver
    # Defines database connection url for Oskari content
    db.url=jdbc:postgresql://localhost:5432/oskaridb
    db.username=postgres
    db.password=postgres

    # mark any addition pool property tokens so we can check/add them automagically
    # jdbc/OskariPool is used for myplaces and analysis and user data store, if there is no definition for extra pools
    #
    #db.additional.pools=myplaces,analysis

    # jdbc/omat_paikatPool
    #db.myplaces.jndi.name=jdbc/OskariPool
    #db.myplaces.url=jdbc:postgresql://localhost:5432/oskaridb
    #db.myplaces.username=postgres
    #db.myplaces.password=postgres

    # jdbc/analysisPool
    #db.analysis.jndi.name=jdbc/OskariPool
    #db.analysis.url=jdbc:postgresql://localhost:5432/oskaridb
    #db.analysis.username=postgres
    #db.analysis.password=postgres
    ##################################

    ....

    # user data store (user layers) properties  - fix url, user/pw items
    #User layers WFS url
    userLayer.oskari.url=http://localhost:8082/geoserver/oskari/wfs?
    userlayer.user=admin
    userlayer.password=geoserver
    # Userlayer base WFS layer id for vuser_data layer (look at oskari_maplayer table)
    userlayer.baselayer.id= [find out after executing example-userlayer-wfs-baselayer.sql  ]
    # userlayer base proxy url because proxy denies geoservers requests -> routed through this server
    userlayer.baseproxy.url=
    # Userlayer rendering Url for Liferay environmet
    # if commented out, then ..userlayertile.. setup is used -
    #userlayer.rendering.url=/karttatiili/userlayerhandler?

    # Userlayer rendering Element (view table)
    userlayer.rendering.element=oskari:user_layer_data_style
    # Userlayer max features count  allowed to store
    userlayer.maxfeatures.count=4000

    oskari.proxy.userlayertile.url=http://localhost:8082/geoserver/wms?buffer=128&tiled=yes&tilesorigin=0,0&CQL_FILTER=
    oskari.proxy.userlayertile.handler=fi.nls.oskari.proxy.UserLayerProxyHandler
    oskari.proxy.userlayertile.user=admin
    oskari.proxy.userlayertile.pass=geoserver

    # oskari.proxyservices = print, property, wfsquery, myplacestile, analysistile, userlayertile
    oskari.proxyservices = userlayertile



### Test Oskari

Start e.g. `http://localhost:2373/oskari-map?uuid={uuid}` in your browser. Replace `{uuid}` with the id of the view you created.
Logged in users should be able to import for example shapefiles.

## Troubleshooting

    * Database operations failed --> look at Jetty (oskari-map.war) log stream  or Postgres log (/var/lib/pgsql/9.3/data/pg_log/)
    * Database permission problems --> edit /var/lib/pgsql/9.3/data/pg_hba.conf
    * Is there password for postgres  --> use psql  / passwd postgres

## Guidelines for GeoServer configuration

Open GeoServer admin interface (e.g. `http://localhost:8082/geoserver`, default credentials: admin/geoserver).

### Create a workspace

*Skip this, if oskari workspace is already there*.
Create a new workspace *oskari* . Set it as default and enable WFS and WMS services. Set namespace URI to e.g. http://www.oskari.org.

### Create a store

Add your database as a new postgis store:

* Store -> Add new Store -> PostGIS Database
* Select *oskari* as workspace and name the data source "user_layers"
* Check it as enabled
* Set the connection parameters, for example: 
    * host: localhost, port: 5432
    * database: oskaridb, schema: public
    * user: *username*, passwd: *password* (sample default postgres/postgres)

### Add metadata table for primary key

* Stores -> select user_layers -> insert to **Primary key metadata table** "gt_pk_metadata_table"  -> Save

### Create a style


You can create your own style choosing Styles and modifying existing style or uploading a new style file.

You can find an example file  `\oskari\oskari-server\content-resources\config\geoserver\data\styles\UserLayerDefaultStyle.sld`
which is used for user data layer rendering / layer: `user_layer_data_style`.



### Add layers

Add layers `user_layer` , `user_layer_data_style`  and `vuser_layer_data`

* Layers -> Add a new resource -> Add layer from "oskari:user_layers"
* Publish `user_layer` (no geometry field):
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Native bbox (50000, 6400000, 800000, 8000000)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Save
* Publish `vuser_layer_data` (for WFS and for to fetch feature data) :
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Native bbox (50000, 6400000, 800000, 8000000)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Publishing -> Set Default Style (e.g. "Polygon")
    * Save
* Publish `user_layer_data_style` (view table for rendering user layers (GetMap)):
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Native bbox (50000, 6400000, 800000, 8000000)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Publishing -> Set Default Style ( "UserLayerDefaultStyle")
    * Save

### Add a data security rule for layers

    * Add read access to everyone (user_layer, vuser_layer_data_data and user_layer_data_style)


### Setup cache (optional)

Select `oskari:user_layer_data_style` layer -> tile caching setup:

* Create a cached layer for this layer (use default values)
* Set gutter size in pixels to 100
