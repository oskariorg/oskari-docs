# Creating a database for the oskari-server component

This document describes how to set up a single database for the oskari-server component.

The standalone Oskari server depends on the availability of PostgreSQL with
PostGIS extension for serving content and authenticating users.

### Assumes pre-installed:

* [PostgreSQL 11+](http://www.postgresql.org/) (Known to work with 11, 12, 14 mainly affected by the FlywayDB version we use. Developed using 14)
* [PostGIS](http://postgis.net/) (developed using 3)

### 1. Create empty database with PostGIS extension

The default configurations assume the database name is "oskaridb". It's configurable in oskari-ext.properties. Run the create database SQL in for example psql or pgAdmin:

     CREATE DATABASE oskaridb
     WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = -1;

Add the PostGIS extension (for the oskaridb database) by first connecting to the database (example for psql):

    \c oskaridb

Add the extension by running SQL:

    CREATE EXTENSION postgis;

### 2. Setup a database user for oskaridb

	CREATE USER oskari WITH PASSWORD 'oskari';
	GRANT ALL PRIVILEGES ON DATABASE oskaridb to oskari;

The preconfigured user in Oskari Jetty-bundle is oskari with the password oskari.
See [Setup Jetty](/documentation/backend/setup-jetty) documentation for details where changes are needed when using another database user.

### 3. Application initialization and database content

The empty database will be populated when the oskari-server is started for the first time. The database population is split into modules. The core module creates and migrates the main database tables used by Oskari. The default configuration has a module named "example" enabled that will populate an example app and maplayer to get a nice unboxing experience. You should replace "example" module with your own app configuration and content for anything other than basic development and playing around.

To learn how to customize Oskari including populating the database with your own content instead of example content see:
* [Create a custom Oskari-server extension](/documentation/backend/setup-server-extension)
