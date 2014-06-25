# Component architecture

## Backend components in oskari-server

There are three different web applications for Oskari backend functionality at the moment:

* `webapp-map` is the basis for Oskari backend functionality. It produces the map pages and handles AJAX requests.
* `servlet-printout` handles PDF/PNG print functionalities and print preview images.
* `transport` handles most of the WFS operations.

The backend components are layered as services, controls, interfaces (though only `webapp-map` uses this extensively at the moment).

![Component layers](/images/architecture/components.png)

### Service layer

Service modules should be common libraries usable in any application. The actual business logic for Oskari operations should be in these modules.

* `service-base` has some common helpers and domain classes which are used throughout Oskari backend.
* `service-permission` is a generic authorization lib for deciding who gets to see/do what
* `service-search` is a generic search lib that can be extended by adding and registering [search channels](/documentation/backend/searchchannels)
* `service-map` has most (maybe a bit too much) of the business logic for servicing the Oskari functionalities
* `service-control` defines the control/routing structures/interfaces for control-layer to build upon.
* `shared-test-resources` has some common helpers/templates to help testing

### Control layer

Control modules build on top of the service layer.

![Service description](/images/architecture/Service.png)

* `control-base` is the basis for all control-modules and has most of the basic AJAX handlers needed by the Oskari frontend. 
    * *NOTE! `control-base` contains some very specific functionalities that should be separated into separate control-extensions (for example analysis and thematic maps support)*
* `control-myplaces` has AJAX funtionality related to myplaces functionality.
* `control-example` has example implementations for AJAX functionalities required by Oskari but usually overridden by platform specific functionalities such as user and content management.
* `content-resources` has tools, templates and scripts for populating and upgrading the database

Functions:

* Handles AJAX requests made by Oskari frontend
* Parses request parameters for input values to be used on service invocations (ActionParameters is not )
* calls one or more services to do business logic
* format a response based on service response

### Interface layer

The interface-modules build on top of the control-modules. Basically an HTTP interface with reference implementations for:

* HTTP Servlet: `oskari-server/servlet-map`
* Webapp: `oskari-server/webapp-map`
* Portlet: `oskari-liferay/portlet-map-example` (deployable to Liferay Portal)

Responsible for:

* Handling user sessions 
* Generating an ActionParameters object based on incoming request abstracting/normalizing the request for control layer
* Forwarding the request to control layer

### Case www.paikkatietoikkuna.fi

* Browser
    * Oskari frontend

* Proxy server
    * HAProxy
    * Apache

* Application servers - Oskari-map
    * Tomcat/Liferay
    * Jetty/Geoserver

* dmz
    * Jetty/Transport
    * Redis

* Services
    * Jetty/Printout
    * Redis

* Database server
    * Postgres/Database

### Case ELF (front-servlet-postgresql)

All in one:

* Proxy: apache
* oskari-map: Jetty
* postgres

### Case OskariVM (Ubuntu)

All in one:

* Proxy: Nginx
* Oskari-map + Geoserver + Transport: Jetty

### Case dev.paikkatietoikkuna.fi

All in one:

* Proxy: HAProxy + Apache
* Oskari-map: Tomcat + Liferay
* Geoserver + Transport + Printout: Jetty

### Case Liikennevirasto

* Oskari frontend with custom modifications
* Custom backend with Scala