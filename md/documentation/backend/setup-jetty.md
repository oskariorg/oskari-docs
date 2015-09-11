# Jetty 8.1.16 with pre-installed/configured Oskari

After this you will have Oskari running including 

- Oskari frontend code (https://github.com/nls-oskari/oskari)
- Oskari server (map functionality: https://github.com/nls-oskari/oskari-server/tree/master/webapp-map)
- Oskari transport (WFS services: https://github.com/nls-oskari/oskari-server/tree/master/webapp-transport)
- Oskari printout (Print services: https://github.com/nls-oskari/oskari-server/tree/master/servlet-printout)
- Geoserver 2.7.1 with WPS-plugin and Oskari extensions (https://github.com/nls-oskari/oskari-server/tree/master/geoserver-ext)

### Requirements

* JDK 1.7+ (tested with Oracle Java 1.7.0_51 and 1.8.0_05, should run on OpenJDK as well)
* Database available: [Instructions for setting up database](/documentation/backend/setup-database)
* Redis (Optional, required for WFS and print functionalities) 

## Setting up Jetty

1) Download the [Jetty Bundle](/download)

2) Unpack the zip file to selected location

The zip includes README.txt, KnownIssues.txt and the Jetty folder (referred as `{jetty.home}`)

3) Configure the database properties (host/credentials) by editing `{jetty.home}/resources/oskari-ext.properties`

    db.url=jdbc:postgresql://[host]:[port]/[dbname]
    db.username=[user]
    db.password=[passwd]

4) Startup the Jetty by running (in `{jetty.home}`)

    java -jar start.jar

5) After Jetty is up and running open a browser with URL

    http://localhost:8080


You can login as:
- user with username "user" and password "user" 
- admin with username "admin" and password "oskari"

---

### Defaults/assumptions

The preconfigured Jetty uses these defaults. These can be changed by modifying `{jetty.home}/resources/oskari-ext.properties`.

Redis:
- redis running on localhost at default port (6379)

Database (Postgres with postgis extension)
- db URL: localhost in default port (5432)
- db name: oskaridb
- db user: postgres/admin

Geoserver (provided in jetty bundle)
- url: http://localhost:8080/geoserver
- user: admin/geoserver
- datadir: {JETTY-HOME}/geoserver_data (configurable in {JETTY-HOME}/start.ini)
- if local geoserver content doesn't seem to work correctly (log shows "feature not on screen" or SRID errors) -> try logging into geoserver and reload the feature type under layers (my_places_categories, user_layer_data_style, analysis_data_style). This is propably due to geoserver starting before Oskari has created the database. We are exploring the option to configure Geoserver through it's REST API to workaround this and preconfigured datadir.

Oskari (provided in jetty bundle)
- url: http://localhost:8080/


## Custom configurations

### Changing the default port

- change in `{jetty.home}/etc/jetty.xml`
    
    <Call name="addConnector">
      <Arg>
          <New class="org.eclipse.jetty.server.nio.SelectChannelConnector">
            <Set name="port"><Property name="jetty.port" default="8080"/></Set>

- change `{jetty.home}/resources/oskari-ext.properties` where ever `8080` is referenced 
- change `{jetty.home}/resources/transport-ext.properties` where ever `8080` is referenced 
- check the "Using external Geoserver" below (also refers to localhost:8080 port)

### Proxy settings

If you need a proxy to access internet you can configure it in `{jetty.home}/start.ini`

	-Dhttp.proxyHost=
	-Dhttp.proxyPort=
	-Dhttp.nonProxyHosts=
	-Dhttps.proxyHost=
	-Dhttps.proxyPort=
	-Dhttps.nonProxyHosts=

### Database url/name/user/pass are changed
`{jetty.home}/resources/oskari-ext.properties` needs to be updated

	db.url=jdbc:postgresql://[host]:[port]/[dbname]
	db.username=[user]
	db.password=[passwd]

Stores in geoserver needs to be updated and re-enabled for myplaces/analysis/userlayers to work

### Using external Geoserver
- `{jetty.home}/resources/oskari-ext.properties` needs to be updated (multiple geoserver references)
- layers pointing to local geoserver in database needs to be updated (table: oskari_maplayer - columns: url, username and password)

### Using external Redis
`{jetty.home}/resources/oskari-ext.properties` needs to be updated 

	redis.hostname=localhost
	redis.port=6379
	redis.pool.size=10