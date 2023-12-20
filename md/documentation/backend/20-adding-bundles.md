# Adding Bundles to default view based on role

Admin bundles require PostgreSQL to be used since some of the bundles use db specific sql.

1) Dynamically added bundles are configured in `oskari-server/servlet-map/src/main/resources/oskari.properties`. As example bundles admin-layerselector and
admin-layerrights are added for users with role Admin for the default view.

    actionhandler.GetAppSetup.dynamic.bundles = admin-layerselector, admin-layerrights
    actionhandler.GetAppSetup.dynamic.bundle.admin-layerrights.roles = Admin
    actionhandler.GetAppSetup.dynamic.bundle.admin-layerselector.roles = Admin

The property `actionhandler.GetAppSetup.dynamic.bundles` is a comma-separated list of bundle identifiers
that we want to add when loading the default view. The listed bundles can then be added for users with roles
referenced in properties with syntax `actionhandler.GetAppSetup.dynamic.[BUNDLE ID].roles`. These properties 
have values of comma-separated lists of role names.

2) Restart the jetty instance

3) Open a browser with `http://localhost:2373/`

4) log in with the admin user 

You should see the listed bundles added to the view. 

Note! Dynamic bundles are only added for default view. If you want to use view 2 for default view you can add 
a property `view.default=2` to `servlet-map/src/main/resources/oskari.properties`