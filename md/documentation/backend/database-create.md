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

The empty database will be pre-populated when the oskari-server is called for
the first time (checked by existance of known tables).

To learn how to populate the database with your own content instead of demo content see:
* [Instructions for modifying the initial demo data](/documentation/backend/database-customize-initial-data)
* [Documentation for DB populator](/documentation/backend/database-populate)
