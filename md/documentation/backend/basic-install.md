# Oskari server libraries and example servlet implementation

## A. Overview

The `oskari-server` repository contains a servlet implementation and server component libraries (services) used by [Oskari](https://github.com/nls-oskari/oskari) javascript framework.
The repository also contains standalone Jetty runner module `jetty-standalone` to embed the servlet in. Also a module `webapplication` is provided to generate a `war` package with servlet and its dependencies so that one can
deploy the web application to an external web server.

* Note! Both `oskari-server` and `oskari` repositories have `master` and `develop` branches, master is the stable version and develop is the next version that is under development

## B. Get started

[Get Oskari running in standalone mode](/documentation/backend/standalonebackend)

## Further reading

[Instructions for modifying the initial demo data](/documentation/backend/modifying-initial-data)

[Instructions for adding your own ajax endpoints/action routes](/documentation/backend/adding-action-routes)

[Adding admin bundles for admin role](/documentation/backend/adding-bundles)