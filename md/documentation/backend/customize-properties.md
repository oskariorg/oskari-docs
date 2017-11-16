# Customizing the application for your environment

Most settings can and should be overridden to match your environment by including an `oskari-ext.properties` in the server classpath for example in Jetty you can add the custom properties as `{JETTY_HOME}/resources/oskari-ext.properties`.

## Properties

The default values for properties used in the map application is found in `oskari-server/servlet-map/src/main/resources/oskari.properties`. To override all or any of these you can add an `oskari-ext.properties` file in your classpath.

Any existing property will be overridden and any new ones will be available through `PropertyUtil` methods in the application (for example `PropertyUtil.get("propertyName")`).

Examples:

    # set to true to get database populated with initial demo content
    oskari.init.db=false

    # true all ssl certs/hosts for debugging! configure certs on the server for production
    oskari.trustAllCerts=true
    oskari.trustAllHosts=true

    # url path to call for ajax requests/action routes
    oskari.ajax.url.prefix=/action?

    # Supported locales, comma separated and default first
    oskari.locales=en_US,fi_FI,sv_SE

The properties also setup various url links for search service, GIS metadata, GeoServer myplaces, print service, etc that needs to be modified to match the server environment.


### Configuration for transport (WFS-service integration)

Config options for `transport-ext.properties` for controlling when to stop sending requests to WFS-services that don't answer fast enough
(service might be slowed down by getting too many requests and we don't want to pile up requests that will fail):

    # Timeout WFS-requests after 25 seconds by default
    oskari.transport.job.timeoutms = 25000

    # milliseconds as observation window for counting failures before stop sending more WFS-requests to a problematic service (defaults 100 seconds)
    oskari.transport.rollingwindow = 100000

    # amount of WFS-requests that need to fail/layer in rolling window to do a cooldown (circuit break)
    oskari.transport.failrequests = 5

    # milliseconds to wait after circuit break until start sending new WFS-requests to problematic WFS-service (defaults 20 seconds)
    oskari.transport.sleepwindow = 20000
