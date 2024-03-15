# Development (basics)

Oskari is developed originally by National Land Survey of Finland but nowadays there are also other parties developing Oskari in their projects. NLS is still the coordinator of Oskari and is developing the platform actively. The developed code is Open Source so it can be exploited freely by anyone interested. It is desirable that the developments made by other parties would be integrated with the latest NLS version of Oskari. The preferred way of contributing Oskari is described in [How to contribute](/documentation/development/how-to-contribute)

## Requirements

* experience in JavaScript and/or Java development
* knowledge of basic geographical protocols used extensively in GIS applications, such as WMS (Web Map Service) and WFS (Web Feature Service)

## Developing frontend

Oskari user interface is implemented as a collection of reusable bundles. Bundles are used as uniform containers to ship and share new functionality to the application setups. Oskari uses standard Open Source components such as OpenLayers, GeoTools, Jackson and jQuery. The developed Open Source code stitches these applications together and makes it possible to extend the functionality of the platform in a coordinated manner.

Oskari Frontend is implemented in JavaScript.

## Developing backend

The `oskari-server` repository contains Java backend used by Oskari javascript framework. The backend is modularized and tiered into different types of Maven modules:
* HTTP API tier: webapps, servlets (also portlets in `oskari-liferay` repository)
* Control tier: maps HTTP requests into service/database calls.
* Service tier: component libraries usable in other contexts as well and used by control tier to form a response.

These are described more thoroughly in [architecture components](/documentation/architecture/components) document.
