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

## Environment variables

Environment variables can also be used to append or override any property set in properties files. Any set environment variable will take precedence over a property in properties files following the two rules:
* To avoid issues with casing and dots with environment variables all environment variables have to be uppercased and use underscores (`_`) instead of dots (`.`)
* To avoid conflicts with environment variables meant for other processes Oskari expects all environment variables to be prefixed with `OSKARI_`

Examples:

    # oskari-ext.properties
    db.url=jdbc:postgresql://localhost:5432/oskaridb
    db.username=oskari
    db.password=oskari

    # Using environment variables to override the configuration (bash example)
    export OSKARI_DB_URL=jdbc:postgresql://localhost:2345/oskaridb
    export OSKARI_DB_USERNAME=oskari2
    export OSKARI_DB_PASSWORD=my-password
