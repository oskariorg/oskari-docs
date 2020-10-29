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
