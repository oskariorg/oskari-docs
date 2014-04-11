# Standalone Oskari backend/frontend

## A. Overview

This document describes how to run Oskari server and serve Oskari content without setting up external web server
or deploying servlets to existing servlet container.

Standalone Oskari server depends on PostgreSQL for serving content and authenticating users.

Assumes pre-installed:

* JDK 1.7+ (tested with Oracle Java 1.7.0_51)
* Cygwin32 or 64, if Windows environment (Windows 7 tested)
* [Maven 3+](http://maven.apache.org/) (tested with 3.0.5)
* Git client
* [PostgreSQL 9.1+](http://www.postgresql.org/) (tested with 9.3)

## B. Quick Start

### 1. Create oskaridb data base with pgAdmin or with psql

     CREATE DATABASE oskaridb
     WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = -1;


### 2. Fetch Oskari source code

    # Install Oskari frontend
    cd <work-dir>
    git clone https://github.com/nls-oskari/oskari
    # Install Oskari backend
    git clone https://github.com/nls-oskari/oskari-server.git

### 3. Install maven dependencies not found in common repositories

Run maven installation instructions documented in `oskari-server/external-libs/mvn-install.txt`

### 4. Make Oskari front-end code accessible to Oskari server

    mv <work-dir>/oskari <work-dir>/Oskari

* Note! Both oskari-server and oskari folders need to be on the same folder level for example `/work/oskari-server/` and `/work/Oskari/`

### 5. Build Oskari server

This will build all modules that Oskari server is composed of.
One of the modules is `standalone-jetty` which we will use to run Oskari server with.

    cd <work-dir>/oskari-server
    mvn clean install

### 6. Setup data fixture

In order for Oskari to work we will need to add some content into the PostgreSQL database that you just created in step 1.

    cd <work-dir>/oskari-server/content-resources
    mvn compile exec:java -Ddb.username=<db-username> -Ddb.password=<db-password> -Doskari.dropdb=true -Doskari.setup=postgres-default

Replace `db-username` and `db-password` with username and password you want to use to access the PostgreSQL with.
The above assumes that you are running the PostgreSQL in localhost in port 5432. In case PostgreSQL is running in different host and/or port
modify `url` in `db.properties` - file in `<work-dir>/oskari-server/content-resources/src/main/resources` to refer to your PostgreSQL - instance.

### 7. Start Oskari server using standalone Jetty

Start server:

    cd <work-dir>/oskari-server/standalone-jetty
    mvn -Ddb.username=<db-username> -Ddb.password=<db-password> exec:java

The above assumes that you are running the PostgreSQL in localhost in port 5432. In case PostgreSQL is running in different host and/or port
modify `db.jndi.url` in `standalone.properties` - file in `<work-dir>/oskari-server/standalone-jetty/src/main/resources` to refer to your PostgreSQL - instance.

Now Oskari server is running in 2373. To change the port where Oskari is running modify `standalone.properties` - file
in `<work-dir>/oskari-server/standalone-jetty/src/main/resources` to refer to your PostgreSQL - instance.

To see Oskari in action direct your browser to `http://localhost:2373/`.

You can login with username "user" and password "user" as a normal user or "admin"/"oskari" as an admin user.

### 8. Properties

File `<work-dir>/oskari-server/servlet-map/src/main/resources/oskari.properties`: setup of various url links for search service, GIS metadata, GeoServer myplaces, print service, etc

## C. Authorization

### 1. Adding new users

* Add user to `oskari_users` - table:

    INSERT INTO oskari_users(user_name, first_name, last_name, uuid) VALUES('username', 'Oskari', 'Olematon', 'fdsa-fdsa-fdsa-fdsa-fdsa');

* Add user to `oskari_jaas_users` - table for authentication:

    INSERT INTO oskari_jaas_users(login, password) VALUES('username', 'MD5:xyzxyzxyz...');

Note that username needs to match in these two tables. Passwords should be encrypted in the database table. For more information see http://www.eclipse.org/jetty/documentation/current/configuring-security-secure-passwords.html

`oskari_jaas_users` is used for JAAS authentication only.

### 2. Adding new roles

* Add role to `oskari_roles` - table:

    INSERT INTO oskari_roles(name) VALUES('MyRole');

### 3. Map users to roles

* Add mapping to `oskari_role_oskari_user` - table:

    INSERT INTO oskari_role_oskari_user(user_name, role_id) VALUES('username', (SELECT id FROM oskari_roles WHERE name = 'MyRole'));

### 4. Map permissions to roles

* Add permission to `oskari_permission` - table:

    INSERT INTO oskari_permission(oskari_resource_id, external_type, permission, external_id) values
    (<resource-id>, 'ROLE', 'VIEW_LAYER', (SELECT id FROM oskari_roles WHERE name = 'MyRole'));

Note that `<resource-id>` needs to point to an existing resource in `oskari-resource` - table.

## D. Map layers

### 1. Add new layer

* edit script file `<work-dir>/oskari-server/servlet-map/src/main/resources/fi/nls/oskari/map/servlet/db/exampleLayersAndRoles.sql`

* add row to `portti_layerclass` table, e.g.

      INSERT INTO portti_layerclass (namefi, namesv, nameen, maplayers_selectable, group_map, locale, parent) values ('Geologian tutkimuskeskus','Geologiska forskningscentralen','Geological Survey of Finland',true,false,'{ fi:{name:"Geologian tutkimuskeskus"},sv:{name:"Geologiska forskningscentralen"},en:{name:"Geological Survey of Finland"}}',null);

* add row to `portti_maplayer` table, e.g.

      INSERT INTO portti_maplayer (layerclassid, namefi, namesv, nameen, wmsname, wmsurl, opacity, style, minscale, maxscale, description_link, legend_image, inspire_theme_id, dataurl, metadataurl, order_number, layer_type, locale) VALUES (3,'Maaperäkartta 1:20 000 / 1:50 000','Jordartskarta 1:20 000 / 1:50 000','Superficial deposits map 1:20 000 / 1:50 000','3','http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer',75,'',100000,10000,'http://www.paikkatietoikkuna.fi/web/guest/maaperakartta-1/20000', 'http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta20k.png',11,'0f3f054f-ad70-4cf1-a1d1-93589261bd04','',2,'wmslayer', '{ fi:{name:"Maaperäkartta 1:20 000 / 1:50 000",subtitle:""},sv:{name:"Jordartskarta 1:20 000 / 1:50 000",subtitle:""},en:{name:"Superficial deposits map 1:20 000 / 1:50 000",subtitle:""}}');

* execute F. Tips and Tricks 1

## E. Database

The SQL scripts that generate the PostgreSQL database are located in the directory `<work-dir>/content-resources/src/main/resources/sql/PostgreSQL/`. The database structure is documented in detail [here](/architecture/database).

### 1. Bundle tables

* `portti_bundle` (definition of all available  bundles)
* `portti_view_bundle_seq` (bundle <--> view relations, plugin configs, state configs)

### 2. View tables

* `portti_view` (definition of all available views)
* `portti_view_supplement` (extra data for view)

### 3. Authorization tables

* `oskari_jaas_users` Used to authenticate user with JAAS and `org.eclipse.jetty.jaas.spi.DataSourceLoginModule`
* `oskari_users` Used to store user information
* `oskari_roles` Used to store roles
* `oskari_user_oskari_role` Mapping between users and their roles
* `oskari_permission` Permissions granted to roles

### 4. Map layer tables

* `portti_maplayer` (maplayer data: names, wms url, zoom min-max, opacity, layertype, etc )
* `portti_maplayer_metadata` (inspire metadata uuids for linking metadata to map layer)
* `portti_inspiretheme`  (inspire themes for grouping map layers)
* `portti_layerclass` (map service owners for grouping map layers )
* `portti_capabilities_cache` (prefetched wms capabilities requests )


## F. Tips and Tricks

1. Recreate database
  - Run `mvn compile exec:java -Ddb.username=<db-username> -Ddb.password=<db-password> -Doskari.dropdb=true -Doskari.setup=<fixture-id>` in `<work-dir>/oskari-server/content-resources`. Replace `<fixture-id>` with fixture you want to use (for instance postgres-default).
