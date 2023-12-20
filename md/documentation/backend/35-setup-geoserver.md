# Setup GeoServer for Oskari

This document describes how to setup a GeoServer environment for Oskari. Geoserver is needed for these functionalities:

- myplaces
- analysis
- userlayers

Note! A prepopulated GeoServer configuration/datadir is available under `{jetty.base}/geoserver_data` in the [Jetty bundle](/download). This however uses preconfigured credentials for geoserver and database which you don't want to use for production. The provided datadir uses EPSG:3857. You can change these by running the setup webapp.

### Requirements

* [Jetty bundle](/download) installed
* Optionally an external GeoServer (tested with the version mentioned on download page)

### Using the setup webapp

The Jetty Bundle includes a webapp to help configuring a GeoServer for Oskari using GeoServer REST API. The webapp can be found in `{jetty.base}/setup.war`. It can be deployed by moving the war-file in to `{jetty.bse}/webapps` and once deployed it can be accessed with http://localhost:8080/setup. The setup asks for the native projection you want to use for saving the user content.

When using single GeoServer, you can use these properties for the setup-webapp:

	# geoserver params for setup
	geoserver.url=http://localhost:8080/geoserver
	geoserver.user=admin
	geoserver.password=geoserver

If you want to use multiple GeoServers and/or different credentials per functionality, you can configure with "module" prefixes: 

	# geoserver params for myplaces
	geoserver.myplaces.url=http://localhost:8080/geoserver1
	geoserver.myplaces.user=admin2
	geoserver.myplaces.password=geoserver3

	# geoserver params for analysis
	geoserver.analysis.url=http://localhost:8080/geoserver2
	geoserver.analysis.user=admin3
	geoserver.analysis.password=geoserver4

	# geoserver params for userlayers
	geoserver.userlayer.url=http://localhost:8080/geoserver3
	geoserver.userlayer.user=admin4
	geoserver.userlayer.password=geoserver5

Any missing properties will fallback to one without the module part in the property key.

Note! The setup webapp is accessible to anyone once deployed so remove it from `{jetty.base}/webapps` after doing the configuration.

### Details for configuring manually/debug purposes

The code for configuring geoserver can be found here: https://github.com/oskariorg/oskari-server/tree/develop/content-resources/src/main/java/fi/nls/oskari/geoserver

1) Create workspace

- prefix: oskari
- URI: http://www.oskari.org

2) Create store for the functionality (for oskari workspace):

- url: `oskari-ext.properties` key `db.url` (Tries module specific config first: db.[myplaces|analysis|userlayer].url)
- user: `oskari-ext.properties` key `db.username` (Tries module specific config first: db.[myplaces|analysis|userlayer].username)
- password: `oskari-ext.properties` key `db.password` (Tries module specific config first: db.[myplaces|analysis|userlayer].password)
- namespace: `http://www.oskari.org`
- Loose bbox: true

For userlayer functionality defines also `Primary key metadata table`: `gt_pk_metadata_table`

3) Creates layers for the functionalities

Using the store created in step 2.

#### myplaces

a) Data for layers (WFS)
- name: `categories`

b) Data for places (WFS)
- name: `my_places`

c) Rendering for WMS
- name: `my_places_categories`


#### analysis

a) Data for WFS
- name: `analysis_data`

b) Rendering for WMS
- name: `analysis_data_style`

#### userlayer

a) Data for WFS
- name: `vuser_layer_data`

b) Rendering for WMS
- name: `user_layer_data_style`

4) Uploads style specific to the functionality

SLD files can be seen here: https://github.com/oskariorg/oskari-server/tree/develop/content-resources/src/main/resources/sld

5) Updates layers in database with geoserver info

Updates database table `oskari_maplayer` with url/username/password that were used when configuring the Geoserver for "base layers" used for these functionalities. Creates the layers if not present and gives output how to configure them in `oskari-ext.properties` by modifying if they aren't configured properly: 

    myplaces.baselayer.id=[layer id for myplaces]
    analysis.baselayer.id=[layer id for analysis]
    userlayer.baselayer.id=[layer id for userlayer]