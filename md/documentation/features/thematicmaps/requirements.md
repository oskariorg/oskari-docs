# Requirements for thematic maps

*Note! This functionality uses Redis heavily for caching so it needs to be available for the server to work properly.*

## Frontend

These are actions that enable the functionality to work on your apps.

### Vector features support

The VectorLayerPlugin provides support for the adding vector features to the map and is required for thematic maps to work properly. The map visualization is done by adding regions for a region set as vector features to the map. The plugin needs to be started with `mapfull` bundles config referencing it in the plugins array:

    { "id" : "Oskari.mapframework.mapmodule.VectorLayerPlugin" }

The code for VectorLayerPlugin is included in the mapmodule and the sample application has it in the configuration so you shouldn't really need to do anything about it but if you don't see any regions on the map this can be the cause.

If you for some reason don't have you should do an application specific Flyway-migration to add the plugin to the appsetups that you need it in. See server section for details.

### User-interface for thematic maps

For bundling in the user interface you will need to include the `statsgrid` bundle in your applications `main.js`.

If you always show it for users you should use this to include it on the application:

```javascript
import 'oskari-loader!oskari-frontend/packages/statistics/statsgrid/bundle.js';
```

OR if you want to show it to only some users you can reduce the amount of code all users need to download by using the "lazy loader". For example on the embedded map application you want to use this since most of the embedded maps don't usually include thematic maps:

```javascript
import 'oskari-lazy-loader?statsgrid!oskari-frontend/packages/statistics/statsgrid/bundle.js';
```

After modifying the main.js you will need to run `npm run build` to update the build artifacts in the `dist/[version]` folder.

After building a new version with the statsgrid bundle included you can test it out in the browser by running this on the developer console:

```javascript
Oskari.app.playBundle({ bundlename : 'statsgrid' });
```

You should see the user-interface for the functionality show up on the geoportal page.

## Server

### Adding the functionality to geoportal user interface

After bundling in the functionality on the frontend build you will need to tell the server to start the functionality in the appsetups you want to use it with. Usually this is all appsetups of type `USER` and `DEFAULT`.

The actual thematic maps user interface is provided by another bundle: statsgrid that needs to be added to the geoportal views.

You can use a Flyway-migration to add it in your own server-extension:

```java
package flyway.[your module];

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;
import org.oskari.helpers.AppSetupHelper;

/**
 * Adds statsgrid info bundle to all default/user appsetups
 */
public class V1_0_0__add_statsgrid_bundle extends BaseJavaMigration {

    public void migrate(Context context) throws Exception {
        AppSetupHelper.addBundleToApps(context.getConnection(), "statsgrid");
    }
}
```

Note that you need to change the package to match your applications module (in the sample-server-extension the module is called `example` and it's located here: https://github.com/oskariorg/sample-server-extension/tree/master/app-resources/src/main/java/flyway/example). You will also need to change the version number (in the class name) to match your application. Picking the next number from the current version is ok. If this is your first migration for the app you will also need to define the module to be activated in `oskari-ext.properties`:

```
db.additional.modules=myplaces, userlayer, [your module]
```

If you want to test is out before doing the Flyway-migration on the server side you can also add it to a single appsetup by running the below SQL. We recommend using Flyway-migration as you will most likely want to add it to any appsetups the user might have saved in addition to the default appsetup. Replace [appsetup_id] in the SQL below with the id of your default appsetup:

    INSERT INTO oskari_appsetup_bundles (appsetup_id, seqno, bundle_id, config, state)
           VALUES ([appsetup_id],
            (SELECT (max(seqno) + 1) FROM oskari_appsetup_bundles WHERE appsetup_id = [appsetup_id]),
            (SELECT id FROM oskari_bundle WHERE name = 'statsgrid'),
            (SELECT config FROM oskari_bundle WHERE name = 'statsgrid'),
            (SELECT state FROM oskari_bundle WHERE name = 'statsgrid'));

*Note!* You don't need to add the bundle to publish-template or any embedded maps. If the user decides to publish a thematic map, the bundle is automatically added to the embedded maps bundles.

## oskari-server/Maven dependencies

The server-side code for thematic maps are included by default on the sample application, but if you have an oskari-server-extension (like you propably should) make sure you have the dependencies included in the webapp-map/pom.xml:

```xml
<dependency>
    <groupId>org.oskari</groupId>
    <artifactId>control-statistics</artifactId>
    <version>${oskari.version}</version>
</dependency>
<!-- Statistics plugins -->
<dependency>
    <groupId>org.oskari</groupId>
    <artifactId>service-statistics-pxweb</artifactId>
    <version>${oskari.version}</version>
</dependency>
<dependency>
    <groupId>org.oskari</groupId>
    <artifactId>service-statistics-unsd</artifactId>
    <version>${oskari.version}</version>
</dependency>
<!-- /Statistics plugins -->
```

Take a look at the sample webapp-map for details: https://github.com/oskariorg/sample-server-extension/blob/1.4.1/webapp-map/pom.xml#L56-L69. There might be additional adapters available also. Take a look at the folders under oskari-server starting with 'service-statistics-'.

# Next step

See instructions for [configuring](config) the thematic maps functionality.
