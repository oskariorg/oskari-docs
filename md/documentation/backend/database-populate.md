# Database populator

Empty Oskari database is pre-populated with demo content when the server is started. You can also manually populate the content from command-line using Maven.

### Requirements

* [Existing development environment](/documentation/backend/setup-development)

## Database setting

The default database properties can be modified in `oskari-server/content-resources/src/main/resources/db.properties`. Preferrably you can give a reference to a properties file containing you database settings:

	mvn clean install exec:java -Dexec.args="/path/to/oskari-ext.properties"

## Populating database content

After the database connection parameters have been configured the database can be populated with maven running (in `oskari-server/content-resources`):

    mvn clean install exec:java -Doskari.dropdb=true

**NOTE!** `oskari.dropdb=true` doesn't actually mean that the DB is dropped as is. The DB handler checks at the beginning if the DB has any tables it recognizes.
If tables exist the setup file is **NOT** run. The setup file can be *FORCED* to run with `oskari.dropdb=true`. Setup files ***CAN*** drop DB tables so it's important to know what you are doing, hence the safety measure.

## Setup files

The **preferred content customization method** is to create a custom setup-file.

You can configure a specific setup file to run by adding a parameter `-Doskari.setup=[setup file under resources/setup]` - defaults to `app-default` (`oskari-server/content-resources/src/main/resources/setup/app-default.json`). For example the parameter `-Doskari.setup=create-empty-db` references a setup file located in `oskari-server/content-resources/src/main/resources/setup/create-empty-db.json`. The setup file can also be elsewhere in the classpath under `/setup/setupfile.json` path.

The value of the parameter is the filename without extension.

Setup file can have 5 segments: `create`, `setup`, `bundles`, `views`, `layers` and `sql`. These are run in the listed order.

### Create

Used to create tables and setup the database so content can be added.

### Setup

Used to recurse setup files. For example creating empty db and registering bundles is pretty much in each setup file as well as
separate setup files for creating the database step-by-step. With the setup-array a series of "minisetups" can be run from another setup which results in less boilerplate.

### Bundles

Bundle registration. The bundles are registered by running the sql files under `oskari-server/content-resources/src/main/resources/sql/views/01-bundles/[namespace]/[bundle.sql]`.

### Views

Views are created after bundles are registered. Any bundle refered to in a view configuration need to be registered in the previous step.
Views are configured as json under `oskari-server/content-resources/src/main/resources/json/views/[view.json]` and are ran in the order they appear in the setup-file.

The views are created based on the JSON files which try to minimize copy/pasting boilerplate.
This means that when the view JSON references bundles it's enough to only tell the id for the bundle to use.
When the view is created the bundle configuration is read from the registered bundles (database table `portti_bundle`).
After that the bundle config/startup/state is overwritten with the value in the JSON file IF they are defined (if not, the values from `portti_bundle` will be used).

### Layers

Additional layer definitions can be listed here. These are not visible by default unlike those listed in "selectedLayers" within individual view definitions.

### Sql

Array of generic sql statements to add map layers/permissions and other content.
These are similar to the ones in create-step but now we can assume tables are created, bundles are registered and views created.

The SQL files used on database creation can be found in `oskari-server/content-resources/src/main/resources/sql`.
Modifying these files will affect the initial database content/structure when the database is created.

NOTE! When modifying SQL files: all comment lines need to end with ; character or the next SQL statement will not be run! SQL files are parsed by splitting with ; character at the moment.

## Adding a new view

Views can be added without running whole setup-files. Add a sample view with the following command:

    mvn clean install exec:java -Doskari.addview=someview.json

The view JSON is parsed and added as view to the db as it would have been if it had been referenced in a setup-file. The referenced file needs to be in the classpath under `/json/views/someview.json` path.

## Adding a new layer

Layers can be added without running whole setup-files. Add a sample layer with the following command:

    mvn clean install exec:java -Doskari.addlayer=somelayer.json

The layer JSON is parsed and added as layer to the db as it would have been if it had been referenced in a setup/view-file.
The referenced file needs to be in the classpath under `/json/layers/somelayer.json` path.

You can also add layers with SQL, but the JSON-format is preferred. Examples for adding a layers using SQL:

- WMS in `oskari-server/content-resources/src/main/resources/sql/PostgreSQL/example-layers.sql`.
- WMTS in `oskari-server/content-resources/src/main/resources/sql/nlsfi-background-map-wmtslayer.sql`.
- WFS in `oskari-server/content-resources/src/main/resources/sql/PostgreSQL/example-wfslayer.sql`.

Layers have reference to a layer group (`oskari_layergroup` db-table) which currently means the data producer,
but it might become a more generic grouping table in the future. They also can have a link to a list of inspire themes
(themes listed in portti_inspiretheme, links to maplayers via oskari_maplayer_themes).

**NOTE!** For users to see a registered maplayer the layer needs to have permissions. See [permissions documentation](/documentation/backend/permissions) for details. With the JSON-format you can define a role/permission mapping for the layer and permissions are inserted directly to the database.

## Creating a runnable JAR file (Optional)

Run the Maven assembly plugin to create a runnable JAR file (in `oskari-server/content-resources`)

    mvn assembly:assembly

This creates `content-resources\target\content-resources-[VERSION]-jar-with-dependencies.jar` file that can be run with 

	java -jar content-resources-[VERSION]-jar-with-dependencies.jar /path/to/oskari-ext.properties

The same env-parameters (-Dparams) work with the runnable JAR and the properties file reference can be given as simple argument.

## Resource overlay files

You can place new or modified setup files in an external directory tree that follows the same structure
as the files under the resource directory. You must provide the path to this directory using the parameter
`-Doskari.resourceOverlayDir=/path/to/your/overlay/directory`. This makes it possible to use the DB populator
as a standalone tool without modifying the resources contained in it and store your application specific
configuration elsewhere. After creating the assembled runnable JAR you can start it with:

    java "-Doskari.dropdb=true" "-Doskari.setup=yourapp" "-Doskari.resourceOverlayDir=c:/your/overlay" \
    -jar target/content-resources-VERSION-jar-with-dependencies.jar c:/your/db/env.properties