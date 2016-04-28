# Setting up transport wfs service

## 1. Preparation

1. Install Redis

    http://redis.io/ (tested with version 2.6.14 for Linux and 2.4.5 for Windows (available in https://github.com/dmajkic/redis))

2. Configuration

    Redis configuration can be found in `oskari-server/servlet-map/src/main/resources/oskari.properties` but using default values nothing needs to be changed:

        # redis
        redis.hostname=localhost
        redis.port=6379
        redis.pool.size=100

    These can also be overridden with `oskari-ext.properties` or `transport-ext.properties` that are places in server classpath.

3. Start redis (`redis-server`). You may use `redis-cli` for cleaning the cache (`flushall` command).

## 2. Compile

* Go to `oskari-server`
* Compile the transport service with `mvn clean install -f transport-pom.xml` (add `-DskipTests` in case you don't want the tests run)
* Deploy the WAR-file under `/webapp-transport/target/transport-0.0.1.war` on a jetty installation (`cd {JETTY_HOME} && java -jar start.jar`)
* Note! You can rename the war file to `transport.war` on deploy to skip some configuration later

With the default settings you now have:

* redis running on port 6379
* oskari-server running on port 2373 or any port
* transport wfs service running on port 2374 or any port
 

Open your browser with the url for oskari-map (http://localhost:2373/oskari-map or similar).

You should see a map layer of type WFS listed on the maplayers flyout.
Add it to map, zoom close to Helsinki for example and you should see points appearing to the map from the wfs service.

If WFS layer doesn't work, you might need to configure view setup for wfslayer plugin (`default-view.json`)
 and reset the database with `mvn clean install exec:java -Doskari.dropdb=true` OR edit the view configuration by hand in
 database table `portti_view_bundle_seq`:

    UPDATE table portti_view_bundle_seq
    SET config='<updated value>'
    WHERE view_id=<the view id> AND bundle_id = (SELECT id FROM portti_bundle WHERE name='mapfull'))

The plugin can be configured by adding config JSON element:

    {
        "id" : "Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin",
        "config" : {
            "contextPath" : "/transport",
            "hostname" : "localhost",
            "port" : "2374"
        }
    }

Where:

* contextPath = usually the name of the war file you deployed transport to (defaults to "/transport")
* hostname = server domain part or the url where the transport webapp is deployed (defaults to current domain)
* port = port of the jetty hosting transport webapp (defaults to current port)

You may need to change the backend configuration as well.
The available configurations are listed in `/servlet-transport/src/main/resources/transport.properties`. You can override
any of these by adding a `transport-ext.properties` file to servers classpath. Add the properties you want to override
based on your own environment with the same property key as in transport.properties.

Sample config for transport (setup as `transport-ext.properties` in server classpath to override defaults)

    oskari.domain=http://localhost:8888
    oskari.ajax.url.prefix=/oskari-map?

    # base WFS layer ids
    analysis.baselayer.id=<based on your DBs layer id>
    myplaces.baselayer.id=<based on your DBs layer id>

Transport inherits properties from oskari-map configuration so if you have both deployed on the same server you don't need
to configure things twice. Properties are read in order with later overriding the previous:

* oskari.properties
* transport.properties
* oskari-ext.properties
* transport-ext.properties
