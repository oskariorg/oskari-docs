# Updating Oskari version

Note! We are updating the frontend and server versions at the same time and for best compatibility it's best to use same version in both.

## Migration and release notes

Simply updating the Oskari dependency versions for frontend and server and building new versions is enough in most cases. But sometimes there are additional things that need to done when updating. The additional steps will help you when for example the code doesn't compile after updating (some class might have changed on the server for example) or there might be some things that should be done while updating that are not as obvious. These things are documented on the `Migration Guide` in oskari-server repository. You should at least skim through the `Release notes` for both server and frontend to see if there are something that affects you. 

So take a look at these before updating:

- [Migration Guide](https://github.com/oskariorg/oskari-server/blob/master/MigrationGuide.md)
- [Server release notes](https://github.com/oskariorg/oskari-server/blob/master/ReleaseNotes.md)
- [Frontend release notes](https://github.com/oskariorg/oskari-frontend/blob/master/ReleaseNotes.md)

It might be also a good idea to see any PRs/changes for the sample application to see if you should adapt your application:
- https://github.com/oskariorg/sample-application
- https://github.com/oskariorg/sample-server-extension

## Server

Updating an Oskari application that is based on the [sample-server-extension](https://github.com/oskariorg/sample-server-extension) template is event easier than the frontend. For the server the `oskari.version` property is updated by changing the version number in [pom.xml](https://github.com/oskariorg/sample-server-extension/blob/1.2.1/pom.xml#L13) file from the current version in the app:

```
    <properties>
        <oskari.version>1.55.1</oskari.version>
        ...
    </properties>
```

To the new version:

```
    <properties>
        <oskari.version>1.56.0</oskari.version>
        ...
    </properties>
```
After this run `mvn clean install` to generate a new `oskari-map.war` under `[your-server-repository-root]/webapp-map/target`. Replace the `oskari-map.war` under the `oskari-server/webapps` folder (in a setup similar to the Oskari/Jetty download package) with the new one.

## Frontend

Updating an Oskari application that is based on the [sample-application](https://github.com/oskariorg/sample-application) template is fairly simple. For the frontend the oskari-frontend (and possible oskari-frontend-contrib) dependency is updated by changing the version number in [package.json](https://github.com/oskariorg/sample-application/blob/1.2.1/package.json#L9) file from the current version in the app:
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

When updating Oskari version you might also want to change the application version in [package.json](https://github.com/oskariorg/sample-application/blob/1.2.1/package.json#L3) on your application to signal that the application is updated.

After this you need to run `npm install` to install any new/changed libraries and `npm run build` to generate a new build under `[your-application-repository-root]/dist/[version on package.json]`. After building the application server can be served as static resources from Jetty/nginx or similar server.

Note! To use the newly built frontend you will need to update `oskari-ext.properties` under `oskari-server/resources` to link the new frontend version:

      oskari.client.version=dist/[version from your package.json]


### Building the frontend for production

Modern web applications are developed using JavaScript syntax that is not fully supported by older browsers and the code needs to be processed before it can be used by end-user browsers. This step also includes bundling and minifying the code so it's more compact for consumption than the human-friendly version that is used for development. This will reduce the startup time for the end-user dramatically.

With the default sample application (a pre-built version included in the zip downloda) you can run `npm run build` to generate the minified Javascript files. This will result in folders and files generated under `[your frontend repository root]/dist/`.

This works by reading a main.js file that should match the appsetup (bundle collection) used on the website you are creating including any dynamic (role-based) bundles that are added on the fly. So basically all the bundles you want to use in that application. Here's an example for the basic [geoportal appsetup](https://github.com/oskariorg/sample-application/blob/1.3.0/applications/geoportal/main.js) and for an [embedded map](https://github.com/oskariorg/sample-application/blob/1.3.0/applications/embedded/main.js). These are processed when running `npm run build`.

 If you take a look at the package.json [script for build](https://github.com/oskariorg/sample-application/blob/1.3.0/package.json#L19) you can see that the parameter `--env.appdef=applications` is used to point the build to search for applications under the `applications` folder. You can change this in your own app as you wish.

The best point to start customizing your app is changing the `main.js` file under `geoportal` application to only include the bundles that you are using. This reduces the amount of code the end-user needs to load. You can also safely remove the 3D applications if you don't need them. The application for `embedded`/published maps usually stays more or less the same and the `geoportal` one is usually customized based on requirements.

When changing main.js to include application specific bundles and/or customizing the application you need to run `npm run build` again to create new minified result. You will also need to do this when updating the new version of Oskari or after changing any application specific code/bundles you want to use.

## Developing the application specific code

 While developing your application it's recommended to run `npm run start` instead of `npm run build` over and over again. The start script launches a dev-server for the frontend that will process the code while you develop it. The dev-server starts at port 8081 and assumes the normal backend is running on the default port 8080 (The oskari-server based server component). The dev-server also assumes that the client version on the server is configured in `oskari-ext.properties` under `oskari-server/resources` as:

      oskari.client.version=dist/devapp

