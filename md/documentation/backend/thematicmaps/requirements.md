# Requirements for thematic maps

*Note! This functionality uses Redis heavily for caching so it needs to be available for the server to work properly.*

## Frontend statslayer support

The StatsLayerPlugin provides support for the statslayer type maplayers. The map visualization is done by these layers and the regions for a regionset is also fetched from the layer. The plugin needs to be started with mapfull-bundles config referencing it in the plugins array:

    { "id" : "Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin" }

The code is provided by the mapstats bundle and it needs to be loaded in the  startupSequence in mapfull-bundle imports:

    "mapstats": {
        "bundlePath": "/Oskari/packages/mapping/ol2/"
    }

for Openlayers 2 the bundlePath is /Oskari/packages/mapping/ol2/
for Openlayers 3 the bundlePath is /Oskari/packages/mapping/ol3/

In most cases this means that the main "geoportal" appsetups (views of type USER and DEFAULT in portti_view database table) should include the ol2 while the publish-template and any published maps (views of type PUBLISH and PUBLISHED in portti_view database table) should have the ol3 implementation.

The sample application has this enabled by default, but there is no sample Flyway-script to enable it to a customized application. Here's an example for adding the plugin with flyway if you need one: https://github.com/arctic-sdi/oskari-server-extensions/blob/develop/server-extension/src/main/java/flyway/asdi/V1_5_1__Add_marker_support.java. Just change the PLUGIN_NAME to "Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin" and the version in the class name to fit you app-specific Flyway-module.

## Geoportal user interface

The actual thematic maps user interface is provided by another bundle: statsgrid that needs to be added to the geoportal views.

You can use a Flyway-migration to add it in your own server-extension. Here's an example for the sample application: https://github.com/nls-oskari/oskari-server/blob/master/content-resources/src/main/java/flyway/sample/V1_0_8__add_statsgrid_to_default_views.java

Or you can add it manually into the database by replacing [view_id] in the SQL below:

    INSERT INTO portti_view_bundle_seq (view_id, seqno, bundle_id, startup, config, state)
           VALUES ([view_id],
            (SELECT (max(seqno) + 1) FROM portti_view_bundle_seq WHERE view_id = [view_id]),
            (SELECT id FROM portti_bundle WHERE name = 'statsgrid'),
            (SELECT startup FROM portti_bundle WHERE name = 'statsgrid'),
            (SELECT config FROM portti_bundle WHERE name = 'statsgrid'),
            (SELECT state FROM portti_bundle WHERE name = 'statsgrid'));

*Note!* You don't need to add the statsgrid bundle to publish-template or any embedded maps. If the user decides to publish a thematic map, the bundle is automatically added to the embedded maps bundles.

Remember to add the statsgrid bundle to you minifierAppSetup.json as well under the frontend code Oskari/applications/your/app/minifierAppSetup.json for both geoportal  and embedded map apps. This bundle doesn't have map-engine dependency so you can use the same snippet for both:

    {
        "bundlename": "statsgrid",
        "metadata": {
            "Import-Bundle": {
                "statsgrid": {
                    "bundlePath": "/Oskari/packages/statistics/"
                }
            }
        }
    }

The sample application has it included as an example: https://github.com/nls-oskari/oskari/blob/1.40.0/applications/sample/servlet/minifierAppSetup.json#L578-L587. Remember to add mapstats from the previous step to the minifierAppSetup.json as well:

https://github.com/nls-oskari/oskari/blob/1.40.0/applications/sample/servlet/minifierAppSetup.json#L71-L73

https://github.com/nls-oskari/oskari/blob/1.40.0/applications/sample/servlet_published_ol3/minifierAppSetup.json#L12-L14

After this you should have the bundle included in both minifierAppSetups and the actual GetAppSetup response (database table portti_view_bundle_seq). 

## oskari-server/Maven dependencies

The server-side code for thematic maps are included by default on the sample application, but if you have an oskari-server-extension (like you propably should) make sure you have the dependencies included in the webapp-map/pom.xml:

        <dependency>
            <groupId>fi.nls.oskari.service</groupId>
            <artifactId>oskari-control-statistics</artifactId>
            <version>${oskari.version}</version>
        </dependency>
        <!-- Statistics plugins -->
        <dependency>
            <groupId>fi.nls.oskari.service</groupId>
            <artifactId>oskari-statistics-eurostat</artifactId>
            <version>${oskari.version}</version>
        </dependency>
        <dependency>
            <groupId>fi.nls.oskari.service</groupId>
            <artifactId>service-statistics-pxweb</artifactId>
            <version>${oskari.version}</version>
        </dependency>
        <dependency>
            <groupId>fi.nls.oskari.service</groupId>
            <artifactId>oskari-statistics-sotka</artifactId>
            <version>${oskari.version}</version>
        </dependency>
        <!-- /Statistics plugins -->

Take a look at the sample webapp-map for details: https://github.com/nls-oskari/oskari-server/blob/1.40.0/webapp-map/pom.xml#L58-L71. There might be additional adapters available also. Take a look at the folders under oskari-server starting with 'service-statistics-'.

# Next step

See instructions for [configuring](config) the thematic maps functionality.
