# Jetty 9.4.12 with pre-installed/configured Oskari

After this you will have Oskari running including

- Oskari-frontend based sample-application (https://github.com/oskariorg/sample-application)
- Oskari-server based sample webapp (https://github.com/oskariorg/sample-server-extension)
- Geoserver with WPS-plugin and Oskari extensions (https://github.com/oskariorg/oskari-server/tree/master/geoserver-ext)

### Requirements

* JDK 8
* Database available: [Instructions for setting up database](/documentation/backend/setup-database)
* Redis (Optional, required for WFS and statistical functionalities): [Setup Redis](/documentation/backend/setup-redis)

## Setting up Jetty

1) Download the [Jetty Bundle](/download)

2) Unpack the zip file to selected location

The zip includes Howto.md, jetty-distribution-9.4.12.v20180830 (referred as `{jetty.home}`) and oskari-server folder (referred as `{jetty.base}`)

3) Configure the database properties (host/credentials) by editing `{jetty.base}/resources/oskari-ext.properties`

    db.url=jdbc:postgresql://[host]:[port]/[dbname]
    db.username=[user]
    db.password=[passwd]

4) Startup the Jetty by running (in `{jetty.base}`)

    java -jar ../jetty-distribution-9.4.12.v20180830/start.jar

Note that for folder references it's important where you run the command/what is the working directory so run the command in oskari-server folder and refer to start.jar under the {jetty.home}:

5) After Jetty is up and running open a browser with URL

    http://localhost:8080


You can login as:
- user with username "user" and password "user"
- admin with username "admin" and password "oskari"

---

## Defaults/assumptions

The preconfigured Jetty uses these defaults. These can be changed by modifying `{jetty.base}/resources/oskari-ext.properties`.

Redis:
- redis running on localhost at default port (6379)

Database (Postgres with postgis extension)
- db URL: localhost in default port (5432)
- db name: oskaridb
- db user: oskari/oskari

Oskari (provided in Jetty bundle)
- url: http://localhost:8080/

## Custom configurations

### Removing the unnecessary parts

Oskari-server can run with just the oskari-map webapp. If you don't need all the features, you can remove them from under `{jetty.base}/webapps`.

You will also need to remove the corresponding parts of the UI so users don't have access to them. This is done by removing "bundles" from "appsetups" (these are Oskari concepts: bundles provide  functionalities and appsetup defines which bundles are used in your app) and currently it needs to be done by modifying the database content. Bundles are linked to appsetups in the database table `portti_view_bundle_seq` and functionalities are removed from the UI by deleting rows from the table.

### Editing article content

- User guide: edit the file in {jetty.base}/resources/articlesByTag/userguide.html
- Publisher terms of use: edit the file in {jetty.base}/resources/articlesByTag/termsofuse__mappublication__en.html

### Changing the default port

- provide port in command line:

    java -jar ${jetty.home}/start.jar jetty.http.port=8080

- change `{jetty.base}/resources/oskari-ext.properties` where ever `8080` is referenced

### Proxy settings

If you need a proxy to access internet you can configure it in `{jetty.base}/start.d/oskari.ini`

	-Dhttp.proxyHost=
	-Dhttp.proxyPort=
	-Dhttp.nonProxyHosts=
	-Dhttps.proxyHost=
	-Dhttps.proxyPort=
	-Dhttps.nonProxyHosts=

### Database url/name/user/pass are changed
`{jetty.base}/resources/oskari-ext.properties` needs to be updated

	db.url=jdbc:postgresql://[host]:[port]/[dbname]
	db.username=[user]
	db.password=[passwd]

### Using external Redis
`{jetty.base}/resources/oskari-ext.properties` needs to be updated

	redis.hostname=localhost
	redis.port=6379
	redis.pool.size=10

### How the Jetty bundle was built

See the Howto.md inside the zip-file for details