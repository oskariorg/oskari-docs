# Creating database for oskari-server

This document describes how to setup a single database for oskari-server components. Standalone Oskari server depends on
PostgreSQL with PostGIS extension for serving content and authenticating users.

### Assumes pre-installed:

* [PostgreSQL 9.1+](http://www.postgresql.org/) (tested with 9.3)
* [PostGIS](http://postgis.net/) (tested with 2.1.0)

### 1. Create empty oskaridb database with PostGIS extension using pgAdmin or psql

     CREATE DATABASE oskaridb
     WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = -1;

    CREATE EXTENSION postgis;

The database will be prepopulated when the oskari-server is called for the first time (checked by existance of known tables).

To learn how to populate the database with your own content instead of demo content
see:
* [Instructions for modifying the initial demo data](/documentation/backend/modifying-initial-data)
* [Documentation for DB populator](/documentation/backend/database-populate)



