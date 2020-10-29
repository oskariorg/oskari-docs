# Enabling Analysis With Postgis (BETA)

**NOTE!** This document describes setup with [GeoServer](http://geoserver.org/). In case you have a different WMS service installed, adjust accordingly.

## Assumes pre-installed:

* JDK 1.8+
* Maven 3+ (tested with 3.0.5)
* [database available](/documentation/backend/setup-database)
* existing [server](/documentation/backend/setup-jetty)
* existing [development environment](/documentation/backend/setup-development)
* configure myplaces and wfs support (http://oskari.org/documentation/backend/enabling-myplaces)

## Configuration

### Create database tables to oskaridb database for analysis result storage

Enable Flyway-module `analysis` on `oskari-ext.properties`:

    db.additional.modules=[...], analysis

# Note! Everything below is outdated

But might give you hints what is required for analysis to work

---

### Create a new view  (analysis + myplaces + wfs)

[Create a new view](/documentation/backend/database-populate#adding-a-new-view) with `analyse`, `myplaces2` and `mapwfs2` bundles :

    cd oskari-server/content-resources
    mvn clean install exec:java -Doskari.addview=postgres-analysis-myplaces2-view.json

Take a note of the uuid the command prints out at the end, you will need it later.

***NOTE!*** *To get analysis timestamps working correctly you need to add triggers to analysis tables.
SQLs for these are listed in `oskari-server/content-resources/src/main/resouces/sql/PostgreSQL/trigger-analysis.sql`.
You need to run these manually in psql or pgAdmin SQL window since at the moment the sql parser can't handle them correctly.*

### Install GeoServer

*Tested with version 2.4.3*

Download [GeoServer](http://geoserver.org/).

Download [WPS extension](http://sourceforge.net/projects/geoserver/files/GeoServer/2.4.3/extensions/geoserver-2.4.3-wps-plugin.zip/download)

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
   `analysis_data` , `analysis_data_style` and `analysis`  (these are empty in the initial state)  (analysis layer)
   `my_places` , `my_places_categories`  and `category` (these are empty in the initial state)   (my places layers)
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
    # jdbc/OskariPool is used for myplaces and analysis, if there is no definition for extra pools
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

    # Analysis properties  - fix url, user/pw items
    #Url for Geoserver WPS request
    geoserver.wps.url=http://localhost:8082/geoserver/wps
    # Url for wfs-t analysis transactions

    geoserver.wfs.url=http://localhost:8082/geoserver/wfs
    geoserver.wms.url=http://localhost:8082/geoserver/wms?buffer=128&tiled=yes&tilesorigin=0,0&CQL_FILTER=
    geoserver.wms.user=admin
    geoserver.wms.pass=geoserver

    # Analysis base WFS layer id -- take analysis layer id defined in oskari_maplayer table
    analysis.baselayer.id=[id]
    # Analysis base proxy url because proxy denies geoservers requests -> routed through this server
    # analysis.baseproxy.url=http://dev.paikkatietoikkuna.fi

    # Analysis rendering Url for Liferay
    # analysis.rendering.url=/karttatiili/analysis?

    # Analysis rendering Element (view table)
    analysis.rendering.element=oskari:analysis_data_style

    oskari.proxy.analysistile.url=http://localhost:8082/geoserver/wms?buffer=128&tiled=yes&tilesorigin=0,0&CQL_FILTER=
    oskari.proxy.analysistile.handler=fi.nls.oskari.proxy.AnalysisProxyHandler
    oskari.proxy.analysistile.user=admin
    oskari.proxy.analysistile.pass=geoserver

    # oskari.proxyservices = print, property, wfsquery, myplacestile, analysistile
    oskari.proxyservices = wfsquery, myplacestile, analysistile


### Test Geoserver WPS

Use `http://localhost:8082/geoserver/web  / Demos / WPS request builder`
You should see gs:FeatureIntersectionCollection2 in "Choose process"-pull down list, if Oskari WPS extensions are installed correctly.

### Test Oskari

Start e.g. `http://localhost:2373/oskari-map?uuid={uuid}` in your browser. Replace `{uuid}` with the uuid of the view you created.
Logged in users can perform analysis functions on the map.

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
* Select *oskari* as workspace and name the data source "analyse"
* Check it as enabled
* Set the connection parameters, for example: 
    * host: localhost, port: 5432
    * database: oskaridb, schema: public
    * user: *username*, passwd: *password* (sample default postgres/postgres)

### Create a style


You can create your own style choosing Styles and modifying existing style or uploading a new style file.

You can find an example file  `\oskari\oskari-server\content-resources\config\geoserver\data\styles\AnalysisDefaultStyle.sld`
which is used for analysis rendering layer `analysis_data_style` .



### Add layers

Add layers `analysis`, `analysis_data`, and `analysis_data_style`

* Layers -> Add a new resource -> Add layer from "oskari:analyse"
* Publish `analysis` (no geometry field):
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Native bbox (50 000, 6400000, 800000, 8000000)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Save
* Publish `analysis_data` (for WFS and WFS-T) :
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Native bbox (50 000, 6400000, 800000, 8000000)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Publishing -> Set Default Style (e.g. "Polygon")
    * Save
* Publish `analysis_data_style` (view table for rendering analyses (GetMap)):
    * Set Declared SRS (e.g. EPSG:3067)
    * Set Native bbox (50 000, 6400000, 800000, 8000000)
    * Set Lat/Lon Bounding Box (e.g. press compute from native bounds)
    * Publishing -> Set Default Style ( "AnalysisDefaultStyle")
    * Save

### Add a data security rule for layers

    * Add read access to everyone (analysis, analysis_data and analysis_data_style) and  write access to authenticated role
      for layers analysis and analysis_data.


### Setup cache

Select `oskari:analysis_data_style` layer -> tile caching setup:

* Create a cached layer for this layer (use default values)
* Set gutter size in pixels to 100
