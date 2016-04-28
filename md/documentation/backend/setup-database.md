# Creating a database for the oskari-server component

This document describes how to set up a single database for the oskari-server component.

The standalone Oskari server depends on the availability of PostgreSQL with
PostGIS extension for serving content and authenticating users.

### Assumes pre-installed:

* [PostgreSQL 9.1+](http://www.postgresql.org/) (tested with 9.3)
* [PostGIS](http://postgis.net/) (tested with 2.1.0)

### 1. Create empty oskaridb database with PostGIS extension using pgAdmin or psql

     CREATE DATABASE oskaridb
     WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = -1;

    \c oskaridb

    CREATE EXTENSION postgis;

### 2. Setup a database user for oskaridb

	CREATE USER oskari WITH PASSWORD 'oskari';
	GRANT ALL PRIVILEGES ON DATABASE oskaridb to oskari;

The preconfigured user in Oskari Jetty-bundle is oskari with the password oskari.
See [Setup Jetty](/documentation/backend/setup-jetty) documentation for details where changes are needed when using another database user.

The empty database will be populated when the oskari-server is started for the first time.

To learn how to populate the database with your own content instead of demo content see:
* [Command-line database setup](/documentation/backend/database-populate)
