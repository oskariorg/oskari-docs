# WFS search functionality deployment

For the `oskari-server` make sure you have the dependency providing the functionality included in the maven `pom.xml`:

    <dependency>
        <groupId>fi.nls.oskari.service</groupId>
        <artifactId>oskari-search-wfs</artifactId>
        <version>${oskari.version}</version>
    </dependency>

The frontend code for getting the administrative user interface is provided by `admin-wfs-search-channel` in the `tampere` namespace. You can add configure it as an admin bundles in `oskari-ext.properties` by adding it to the dynamic bundles list:

    # bundles that are added on runtime to view if user has one of configured role
    actionhandler.GetAppSetup.dynamic.bundles = ... any other bundles..., admin-wfs-search-channel

    # Linking dynamic bundles based on user roles
    # Properties are named 'actionhandler.GetAppSetup.dynamic.[BUNDLE ID].roles'
    #   with value as comma-separated list of role names that should be served the bundle
    actionhandler.GetAppSetup.dynamic.bundle.admin-wfs-search-channel.roles = Admin

This way the bundle will start for any users that have the role named `Admin`.

## Customized search user interface

There is a more specific user interface for end-user searching that goes well with this functionality: `search-from-channels` in the `tampere` namespace. It provides an advanced options panel for the end-user to select which channels to use in a search. You can test it out by adding it to the dynamic bundles setup as with the admin above and if you like it you can add it to all the default/user views for the system in the database. You can use the Flyway-script below in your application specific flyway-module (replace `V1_0_0` with the next available version):

    package flyway.sample;

    import fi.nls.oskari.util.FlywayHelper;
    import org.flywaydb.core.api.migration.jdbc.JdbcMigration;

    import java.sql.Connection;
    import java.util.List;

    /**
     * Adds search-from-channels bundle to default and user views.
     */
    public class V1_0_0__add_search-from-channels_to_default_views implements JdbcMigration {
        private static final String BUNDLE_ID = "search-from-channels";

        public void migrate(Connection connection) throws Exception {
            final List<Long> views = FlywayHelper.getUserAndDefaultViewIds(connection);
            for(Long viewId : views){
                if (FlywayHelper.viewContainsBundle(connection, BUNDLE_ID, viewId)) {
                    continue;
                }
                FlywayHelper.addBundleWithDefaults(connection, viewId, BUNDLE_ID);
            }
        }
    }

More information about Flyway can be found in [here](/documentation/backend/upgrading). Or you can add it to a single view by manually running an SQL like this:

    INSERT INTO portti_view_bundle_seq (view_id, seqno, bundle_id, startup, config, state)
       VALUES ([view_id],
        (SELECT (max(seqno) + 1) FROM portti_view_bundle_seq WHERE view_id = [view_id]),
        (SELECT id FROM portti_bundle WHERE name = 'search-from-channels'),
        (SELECT startup FROM portti_bundle WHERE name = 'search-from-channels'),
        (SELECT config FROM portti_bundle WHERE name = 'search-from-channels'),
        (SELECT state FROM portti_bundle WHERE name = 'search-from-channels'));

By replacing `[view_id]` with the id of the view you want to use it in.