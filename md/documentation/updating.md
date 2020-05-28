# Updating Oskari version

## Frontend

Updating an Oskari application that is based on the [sample-application](https://github.com/oskariorg/sample-application) template is relatively easy. For the frontend the oskari-frontend (and possible oskari-frontend-contrib) dependency is updated by changing the version number in [package.json](https://github.com/oskariorg/sample-application/blob/1.2.1/package.json#L9) file from the current version in the app:
```
  "dependencies": {
    "oskari-frontend": "https://git@github.com/oskariorg/oskari-frontend.git#1.55.2"
  },
```

To the new version:

```
  "dependencies": {
    "oskari-frontend": "https://git@github.com/oskariorg/oskari-frontend.git#1.56.0"
  },

```

You might also want to change the application version in [package.json](https://github.com/oskariorg/sample-application/blob/1.2.1/package.json#L3) on your application to signal that the application is updated.

After this you need to run `npm install` to install any new/changed libraries and `npm run build` to generate a new build under `[your-application]/dist/[version]`.

## Server

Updating an Oskari application that is based on the [sample-server-extension](https://github.com/oskariorg/sample-server-extension) template is relatively easy. For the server the `oskari-server` property is updated by changing the version number in [pom.xml](https://github.com/oskariorg/sample-server-extension/blob/1.2.1/pom.xml#L13) file from the current version in the app:

```
    <properties>
        <oskari.version>1.55.1</oskari.version>
        ...
    </properties>
```

To the new version:

```
    <properties>
        <oskari.version>1.55.1</oskari.version>
        ...
    </properties>
```
After this you need to run `mvn clean install` to generate a new `oskari-map.war` under `[your-server]/webapp-map/target`.

------------------------------------------------------------
TODO: review above and update beneath

# Minifying JavaScript code for production

Minifying the code means that all the files that are needed to build the app are put in a single file and all the "human-friendly" names are changed to be more compact. This will reduce the startup time for the end-user dramatically. With the default download and sample application you can run `npm run build` to generate the minified Javascript files. This will result in `Oskari/dist/servlet` folder being generated.

This works by reading a minifierAppSetup.json file that should match the appsetup (bundle-collection) used on the website including any dynamic (role-based) bundles that are added on the fly. So basically all the bundles you want to use. Here's an example for the basic [geoportal appsetup](https://github.com/oskariorg/oskari-frontend/blob/master/applications/sample/servlet/minifierAppSetup.json) and for an [embedded map](https://github.com/oskariorg/oskari-frontend/blob/master/applications/sample/servlet_published_ol3/minifierAppSetup.json). These are used when running just `npm run build`. If you take a look at the package.json [script-definitions for builds](https://github.com/oskariorg/oskari-frontend/blob/master/tools/package.json) you can see that you can also specify the version and the minifierAppSetups to use for your needs by running a modified command from what are used as the script shortcuts.

The easiest modification with most benefit is changing the minifierAppSetup.json files to only include the bundles that you are using. This reduces the amount of code the end-user needs to load. You can also safely rename the "version" folder from `dist/servlet` to `dist/1.0` or similar. Note that you will need to tell the server what client version to serve. This is done by modifying the `oskari-ext.properties` file:

    # this will toggle minified code on (false) and off (true)
    development=false
    # this will link the correct version of the frontend for the user (if you renamed 'servlet' to '1.0' use 'dist/1.0')
    oskari.client.version=dist/servlet

If the code changes you can do `npm run build` again to create new minified result. You will need to do this when updating the new version or after changing any custom code/bundles you want to use.