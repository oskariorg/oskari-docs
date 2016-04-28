# Setup Oskari development environment

This document describes how to setup development environment for Oskari. 

### Requirements

* JDK 1.7+ (tested with Oracle Java 1.7.0_51 and 1.8.0_05)
* [Maven 3+](http://maven.apache.org/) (tested with 3.0.5)
* Git client (http://git-scm.com/) - Optionally download zip file from https://github.com/nls-oskari/oskari-server
* `{JETTY_HOME}` refers to unzipped [Jetty bundle](/download)

### 1. Fetch Oskari-server source code

With commandline git:

    git clone https://github.com/nls-oskari/oskari-server.git

Note! You can also download the codes in zip format from Github, but for contributing any changes to Oskari git is mandatory. 
Additional Maven modules can be contributed outside git though if they are compatible with the current develop/master branch, but this is not adviced.

Note! The frontend source code is already available under `{JETTY_HOME}/oskari` in the [Jetty bundle](/download). To update it you can do `git pull` or replace it with code found in https://github.com/nls-oskari/oskari.


### 2. Build Oskari server

This will build all modules that Oskari server is composed of.

    cd oskari-server
    mvn clean install

### 3. Copy updated/relevant artifacts under `{JETTY_HOME}/webapps`

- Map functionality: oskari-server/webapp-map/target/oskari-map.war
- WFS services: oskari-server/webapp-transport/target/transport.war
- Print services: oskari-server/servlet-printout/target/oskari-printout-backend.war

### 4. (Optional) To update geoserver extensions:

a) Run `mvn clean install` in `oskari-server/geoserver-ext/wps`

b) Copy updated artifacts to `{JETTY_HOME}/webapps/geoserver/WEB-INF/lib`:
- oskari-server/geoserver-ext/OskariMarkFactory/target/OskariMarkFactory-[version].jar
- oskari-server/geoserver-ext/wps/IntersectionFeatureCollection2/target/IntersectionFeatureCollection2-2.5.2.jar
- oskari-server/geoserver-ext/wps/oskari_point_stacker/target/oskari_point_stacker-2.5.2.jar
- oskari-server/geoserver-ext/wps/ZoneSectorFeatureCollection/target/ZoneSectorFeatureCollection-2.5.2.war

[More information](/documentation/development-environment) about git and Oskari development.