# Modifying the initial demo data

### Assumes pre-installed:

* JDK 1.6+ (tested with 1.6.18)
* Maven 3+ (tested with 3.0.5)
* database available: [Instructions for setting up database](/documentation/backend/database-create)
* existing development environment: [Instructions](/documentation/backend/server-embedded-developer)

## 1. Recreating database

The database is created by default when the server is first called. The database content can be recreated without dropping the database
using the same method that is used by the servlet.

Database recreation can be forced on startup by giving a system.property `oskari.dropdb` with value `true`.

#### When starting the standalone Jetty:

Database connection params defined in `<work-dir>/oskari-server/standalone-jetty/standalone.properties`

    cd <work-dir>/oskari-server/standalone-jetty
    mvn clean exec:java -Doskari.dropdb=true

#### When using the content-resources DB populator

Database connection params defined in `<work-dir>/oskari-server/content-resources/src/main/resources/db.properties`

    cd <work-dir>/oskari-server/content-resources
    mvn clean exec:java -Doskari.dropdb=true

##### NOTE! When modifying SQL files: all comment lines need to end with ; character or the next SQL statement will not be run! SQL files are parsed by splitting with ; character at the moment.

## 2. Customizing data

The SQL files used on database creation can be found in `<work-dir>/oskari-server/content-resources/src/main/resources/sql`.
Modifying these files will affect the initial database content/structure when the database is recreated (as shown in previous step)

### Adding a maplayer

Examples for adding a layer of type:

- WMS in `/oskari-server/content-resources/src/main/resources/sql/PostgreSQL/example-layers.sql`.
- WMTS in `/oskari-server/content-resources/src/main/resources/sql/nlsfi-background-map-wmtslayer.sql`.
- WFS in `/oskari-server/content-resources/src/main/resources/sql/PostgreSQL/example-wfslayer.sql`.

Layers have reference to a layer group (oskari_layergroup db-table) which currently means the data producer,
but it might become a more generic grouping table in the future. They also can have a link to a list of inspire themes
(themes listed in portti_inspiretheme, links to maplayers via oskari_maplayer_themes).

#### For users to see a registered maplayer the layer needs to have permissions.

See [permissions documentation](/documentation/backend/permissions) for details.
Running the SQL file `/oskari-server/content-resources/src/main/resources/sql/PostgreSQL/example-permissions.sql`
will grant sample permissions for the latest maplayer added to the database.

### Insight on database creation

Database creation is based on setup-files found in `/oskari-server/content-resources/src/main/resources/setup`.
Setup-files can refer other setup files, SQL-files or JSON-files describing Oskari application views. The default one that is used is `app-default.json`.

To use another setup file for example `app-parcel` run:

    cd <work-dir>/oskari-server/content-resources
    mvn compile exec:java -Doskari.dropdb=true -Doskari.setup=app-parcel

For more thorough documentation about setup-files see [DB populator documentation](https://github.com/nls-oskari/oskari-server/blob/master/content-resources/README.md)