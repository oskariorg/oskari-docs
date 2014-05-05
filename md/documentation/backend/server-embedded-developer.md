# Standalone Oskari backend/frontend developer setup

This document describes how to run Oskari server and serve Oskari content without setting up external web server
or deploying servlets to existing servlet container.

Standalone Oskari server depends on PostgreSQL with PostGIS extension for serving content and authenticating users.

### Assumes pre-installed:

* JDK 1.7+ (tested with Oracle Java 1.7.0_51 and 1.8.0_05)
* Cygwin32 or 64, if Windows environment (Windows 7 tested)
* [Maven 3+](http://maven.apache.org/) (tested with 3.0.5)
* Git client
* database available: [Instructions for setting up database](/documentation/backend/database-create)

### 1. Fetch Oskari source code

    # Install Oskari frontend
    cd <work-dir>
    git clone https://github.com/nls-oskari/oskari
    # Install Oskari backend
    git clone https://github.com/nls-oskari/oskari-server.git

### 2. Make Oskari front-end code accessible to Oskari server

Rename the oskari-folder to Oskari with capital O

    mv <work-dir>/oskari <work-dir>/Oskari

* Note! Both oskari-server and oskari folders need to be on the same folder level for example `/work/oskari-server/` and `/work/Oskari/`

### 3. Build Oskari server

This will build all modules that Oskari server is composed of.
One of the modules is `standalone-jetty` which we will use to run Oskari server with.

    cd <work-dir>/oskari-server
    mvn clean install

### 4. Start Oskari server using standalone Jetty

Start server:

    cd <work-dir>/oskari-server/standalone-jetty
    mvn exec:java -Ddb.username=<db-username> -Ddb.password=<db-password>

The above assumes that you are running the PostgreSQL in localhost in port 5432. In case PostgreSQL is running in different host and/or port
modify `db.jndi.url` in `standalone.properties` - file in `<work-dir>/oskari-server/standalone-jetty/` to refer to your PostgreSQL - instance.
You can also define the username and password in this properties file and only start the server with `mvn exec:java`

Now Oskari server is running in 2373. To change the port where Oskari is running modify `standalone.properties` - file
in `<work-dir>/oskari-server/standalone-jetty/` with the `oskari.server.port` property:

    # Start the server in this port (defaults to 2373)
    #oskari.server.port=2373

To see Oskari in action direct your browser to `http://localhost:2373/`.

You can login with username "user" and password "user" as a normal user or "admin"/"oskari" as an admin user.

Notice that the `<work-dir>/oskari-server/standalone-jetty/dist` is also updated on standalone-jetty build.
This is the precompiled version of the backend used in [another setup tutorial](/documentation/backend/server-embedded-precompiled)

### 5. Properties

You can configure your own override properties file with a system property `oskari.conf`. By default the standalone.properties are used as if running the command:

    mvn exec:java -Ddb.username=<db-username> -Ddb.password=<db-password> -Doskari.conf=standalone.properties

To use your own properties instead you can replace `standalone.properties` with path to your custom properties file
