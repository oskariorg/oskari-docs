# Setting up Oskari wfs services (transport)

## 1. Preparation

1. Install Redis

    http://redis.io/ (tested with version 2.6.14, 2.8 and 3.0 for Linux and 2.4.5, 2.8 for Windows (available in https://github.com/dmajkic/redis))

2. Configuration

    The default values for Redis configuration are:

        # redis
        redis.hostname=localhost
        redis.port=6379
        redis.pool.size=100

    These can also be overridden with `oskari-ext.properties` or `transport-ext.properties` that are placed in server classpath (in the Oskari Jetty zip-file they are in under {jetty.home}/resources).

3. Start redis (`redis-server`). You may use `redis-cli` for cleaning the cache (`flushall` command).

## 2. Compile

* Go to `oskari-server`
* Compile oskari-server (or your custom oskari-server-extension) with `mvn clean install` (add `-DskipTests` in case you don't want the tests run)
* Deploy the WAR-file under `/webapp-transport/target/transport.war` on a jetty installation (`cd {JETTY_HOME} && java -jar start.jar`)

With the default settings you now have:

* redis running on port 6379
* oskari-server running on port 8080
* transport wfs service running on the same port as oskari-server

Open your browser with the url for oskari-map (http://localhost:8080/ by default).

You should see a map layer of type WFS listed on the maplayers flyout.
Add it to map, zoom close to Helsinki for example and you should see points appearing to the map from the wfs service.

## Error checklist

### Check that you have the 'Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin' configured for the view.

You can check ajax-request the browser makes (action_route=GetAppSetup) or the database table portti_view_bundle_seq.
The important part is that plugins in mapfull bundles configuration should include 'Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin'.
If you have transport running in a different host/port as oskari-server or non-default path it should also include configuration like this:

    {
        "id" : "Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin",
        "config" : {
            "contextPath" : "/transport",
            "hostname" : "localhost",
            "port" : "8081"
        }
    }

Where:

* contextPath = usually the name of the war file you deployed transport to (defaults to "/transport")
* hostname = server domain part or the url where the transport webapp is deployed (defaults to current domain)
* port = port of the jetty hosting transport webapp (defaults to current port)

The config part can be adjusted in oskari-ext.properties:

        # transport (NOTE! this needs to be accessible from browser!!)
        oskari.transport.domain=mydomain.com
        oskari.transport.port=8080
        oskari.transport.url=/transport

If you are not running transport in the same jetty/port/host as oskari-server you will also need to configure oskari-server
location in `transport-ext.properties` file to servers classpath (default location is {jetty.home}/resources/):

    oskari.domain=http://localhost:8080
    oskari.ajax.url.prefix=/action?

    # base WFS layer ids
    analysis.baselayer.id=<based on your DBs layer id>
    myplaces.baselayer.id=<based on your DBs layer id>

Transport inherits properties from oskari-map configuration so if you have both deployed on the same server you don't need
to configure things twice. Properties are read in order with later overriding the previous:

* oskari.properties
* transport.properties
* oskari-ext.properties
* transport-ext.properties
