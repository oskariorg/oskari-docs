# Standalone Oskari backend/frontend using precompiled code

This document describes how to run Oskari server and serve Oskari content without setting up external web server
or deploying servlets to existing servlet container. It uses precompiled code to keep the requirements to a minimum.

Standalone Oskari server depends on PostgreSQL with PostGIS extension for serving content and authenticating users.

### Assumes:

* pre-installed: JDK 1.7+ (tested with Oracle Java 1.7.0_51 and 1.8.0_05)
* database available: [Instructions for setting up database](/documentation/backend/database-create)

### 1. Fetch Oskari-server

[Download as a zip-file](/build/server/oskari-server.zip)

* Unzip the file to `<work dir>` (somewhere you want the server to be located)

### 2. Modify properties to match your environment

Modify `oskari-ext.properties` located in `<work dir>` for example database connection parameters:

    db.url=jdbc:postgresql://localhost:5432/oskaridb
    db.username=<username>
    db.password=<password>

You can also modify the location of static frontend codes with:

    # path to frontend code (absolute or relative to current work dir)
    oskari.client.location=./public/

The folder referenced should contain at least the Oskari frontend code

### 3. Start the server

Change the `[version]` in below to match the filename. Java 7 or higher should be in the path variable of your operating system.

    cd <work-dir>
    java -jar oskari-server-[version].jar

To see Oskari in action direct your browser to `http://localhost:2373/`.

You can login with username "user" and password "user" as a normal user or "admin"/"oskari" as an admin user.