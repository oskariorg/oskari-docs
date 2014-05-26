# Oskari server libraries and servlet implementation

## Overview

The `oskari-server` repository contains Java backend used by [Oskari](https://github.com/nls-oskari/oskari) javascript framework. The backend is modularized and tiered into
different types of Maven modules:
* HTTP API tier: webapps, servlets (also portlets in `oskari-liferay` repository)
* Control tier: maps HTTP requests into service/database calls.
* Service tier: component libraries usable in other contexts as well and used by control tier to form a response.

These are described more thoroughly in [architecture components](/documentation/architecture/components) document.

The repository also contains standalone Jetty runner module `standalone-jetty` to embed the backend functionality into single runnable JAR-file. In addition a module `webapp-map`
is provided to generate a `war` package with servlet handling the basic map backend functionality and its dependencies so that one can deploy the web application to an
external web server.

* Note! Both `oskari-server` and `oskari` repositories have `master` and `develop` branches, master is the stable version and develop is the next version that is under development

## Get started

[Setup database to be used for oskari-server](/documentation/backend/database-create)

Get Oskari running in on server:

* [Precompiled aka the easy way](/documentation/backend/server-embedded-precompiled)
* [For developers](/documentation/backend/server-embedded-developer)
* [Existing server](/documentation/backend/server-webapp)

[Customizing through properties](/documentation/backend/customize-properties)

## Further reading

[Instructions for adding your own ajax endpoints/action routes](/documentation/backend/adding-action-routes)

[Adding admin bundles for admin role](/documentation/backend/adding-bundles)