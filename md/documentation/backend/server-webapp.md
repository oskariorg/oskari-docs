# Deploy Oskari to a servlet container

This document describes how to deploy Oskari server webapp in existing servlet container.

Oskari server depends on PostgreSQL with PostGIS extension for serving content and authenticating users.

Webapp-map has been tested in:

 * Jetty Hightide 8.1.14
 * Tomcat 8.0.5 (JAAS configuration is unavailable for tomcat at this point)

### Assumes pre-installed:

* JDK 1.7+ (tested with Oracle Java 1.7.0_51 and 1.8.0_05)
* Cygwin32 or 64, if Windows environment (Windows 7 tested)
* [Maven 3+](http://maven.apache.org/) (tested with 3.0.5)
* Git client
* database available: [Instructions for setting up database](/documentation/backend/database-create)
* existing server: [Instructions for setting up Jetty](/documentation/backend/server-configuration-jetty)

## 1. Fetch Oskari source code

    # Install Oskari backend
    cd <work-dir>
    git clone https://github.com/nls-oskari/oskari-server.git

## 2. Build Oskari server

This will build all modules that Oskari server is composed of.
One of the modules is `webapp-map` which is the one we are going to deploy.

    cd <work-dir>/oskari-server
    mvn clean install

### Webapp-map build profiles

The `webapp-map` module provides a few pre-made profiles for Jetty and Tomcat and can be customized by adding a new profile definition for maven.

The build filters all resources under `/oskari-server/servlet-map/src/main/resources` and resources under location defined in maven property `profile-resources`.
The property `profile-resources` defaults to profile folder under `/oskari-server/webapp-map/env/` but can be overridden in custom profile.
The values for filtered properties are gathered from filter-property files in:

* `/oskari-server/servlet-map/filter/filter-base.properties`
* `/oskari-server/webapp-map/env/default/default-filter.properties`
* properties file which location is given in `profile-filter` property defined in maven (as example used by tomcat build and can be used for custom profile builds the same way)

To build the webapp with profile `jetty` for example run:

    cd <work-dir>/oskari-server/webapp-map
    mvn clean install -Pjetty

#### NOTE! For any profile including database configuration INSIDE the WAR-file

Edit the db-properties to match your environment in one of the previously mentioned properties files used for filtering the build.

    # Defines database connection url for Oskari content
    db.url=jdbc:postgresql://localhost:5432/oskaridb

    # Defines database connection username for Oskari content
    db.username=<username>

    # Defines database connection password for Oskari content
    db.password=<password>

This can be also avoided by declaring the connection pool in server configuration rather than inside the webapp.
If you encounter problems building the correct setup you can always see the end-product under `/oskari-server/webapp-map/target/oskari-map/`

#### Default

Assumes the servlet container will provide JNDI resource named `jdbc/OskariPool` (name configurable with filter property: `db.jndi.name`).
This means you need to do the optional global connection pool configuration which is marked as optional in Jetty setup guide.

The relevant web.xml is found in `/oskari-server/webapp-map/env/default/WEB-INF/web.xml`

#### Jetty

Defines it's own environment configuration for webapp and as such doesn't rely on the servlet container providing connection pool.

The relevant configurations can be found in `/oskari-server/webapp-map/env/jetty/WEB-INF/`

#### Jetty with JAAS authentication

Defines it's own environment configuration for webapp and as such doesn't rely on the servlet container providing connection pool.
In addition to normal Jetty build includes a JAAS configuration to setup login functionality.

The relevant configurations can be found in `/oskari-server/webapp-map/env/jetty-jaas/WEB-INF/`

#### Tomcat

An example build to show we are not completely Jetty dependent a Tomcat build profile which defines it's own environment configuration for webapp
 and as such doesn't rely on the servlet container providing connection pool. Also uses profile-specific filter.properties since the profile needs more
 than is available in default filter properties.

#### Custom

To add your custom settings add a profile into either the `/oskari-server/webapp-map/pom.xml` or the global Maven settings in `{MAVEN_HOME}/conf/settings.xml`.

    <profile>
        <id>custom</id>
        <properties>
            <profile-resources>/path/to/custom/resources</profile-resources>
            <profile-filter>/path/to/custom/my-filter.properties</profile-filter>
        </properties>
    </profile>

Where `/path/to/custom/resources` folder contents will be copied as webapp resources after being filtered with properties found in default filter properties AND overrides
defined in properties file located in `/path/to/custom/my-filter.properties`

## 3. Deploying

Build the webapp with jetty-jaas profile

    cd <work-dir>/oskari-server/webapp-map
    mvn clean install -Pjetty-jaas

Copy the war package from under `<work-dir>/oskari-server/webapp-map/target/` to your servers deploy folder `{jetty.home}/webapps` (or `{tomcat.home}/webapps`)

## 4.Startup application (example Jetty)

Startup Jetty  (`cmd.exe` in Windows)

    cd {jetty.home}
    java -jar start.jar

or start with proxy setup, if any  eg.

    java -jar start.jar -Dhttp.proxyHost=wwwp.xxx.xx -Dhttp.proxyPort=800 -Dhttp.nonProxyHosts="*.yyy.xx|*.foo.fi" --exec

To see Oskari in action direct your browser to http://localhost:8888/oskari-map (server port based on server configuration).
You can login with username "user" and password "user" as a normal user or "admin"/"oskari" as an admin user.
