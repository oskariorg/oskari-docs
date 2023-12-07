# Setup Oskari development environment

This document describes how to setup development environment for Oskari.

### Requirements

* JDK 8
* [Maven 3+](http://maven.apache.org/) (developed using 3.5.0)
* Git client (http://git-scm.com/) - Optionally download zip file from https://github.com/oskariorg/oskari-server
* `{jetty.base}` refers to the oskari-server folder in an unzipped [Jetty bundle](/download)

### Setup Git configuration

Configure line endings: [https://help.github.com/articles/dealing-with-line-endings/](https://help.github.com/articles/dealing-with-line-endings/)

Ignore file permissions:

	git config --global core.fileMode false

### 1. Fetch Oskari-server source code

With commandline git:

    git clone https://github.com/oskariorg/oskari-server.git

Note! You can also download the codes in zip format from Github, but for contributing any changes to Oskari git is mandatory.
Additional Maven modules can be contributed outside git though if they are compatible with the current develop/master branch, but this is not adviced.

Note! The frontend source code is already available under `{jetty.base}/oskari-frontend` in the [Jetty bundle](/download). To update it you can replace it with code found in https://github.com/oskariorg/oskari-frontend.

### 2. Build Oskari server

This will build all modules that Oskari server is composed of.

    cd oskari-server
    mvn clean install

### 3. Fetch sample-server-extension source code and compile it

To test your changes on a running web app you can use sample-server-extension to create a webapp using your modified version of oskari-server.
Check that the oskari.version in pom.xml matches the project version of oskari-server you built.

    git clone https://github.com/oskariorg/sample-server-extension.git
    cd sample-server-extension
    mvn clean install

### 4. Copy updated/relevant artifacts under `{jetty.base}/webapps`

Map functionality: sample-server-extension/webapp-map/target/oskari-map.war

### 5. (Optional) To update geoserver extensions:

a) Run `mvn clean install` in `oskari-server/geoserver-ext/wps`

b) Copy updated artifacts to `{jetty.base}/webapps/geoserver/WEB-INF/lib`:
- oskari-server/geoserver-ext/wps/IntersectionFeatureCollection2/target/IntersectionFeatureCollection2-2.13.2.jar
- oskari-server/geoserver-ext/wps/oskari_point_stacker/target/oskari_point_stacker-2.13.2.jar
- oskari-server/geoserver-ext/wps/ZoneSectorFeatureCollection/target/ZoneSectorFeatureCollection-2.13.2.war

[More information](/documentation/development-environment) about git and Oskari development.
