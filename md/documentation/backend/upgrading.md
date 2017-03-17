# Upgrading

When upgrading Oskari version the database schema needs to be upgraded as well. As of version 1.31.0 Oskari-server 
will be upgraded an existing database automatically using http://flywaydb.org/. This requires a manual upgrade to
 1.30.0 database schema using steps described at the end of this document. After this the upgrade is automatic and
 the purpose of this document is to describe the procedure and provide insight for debugging on possible error scenarios.

The migration happens when the updated webapp is started. The software version is recorded into the database and each
 upgrade script that is tagged with a later version is executed in version sequence on startup and the current
  database status is updated so the next startup won't trigger the same upgrades.

The upgrade is done with a modular setup with these default modules:   
 - `oskari`: this is the base database for Oskari
 - `myplaces`: these are tables/triggers etc for the my places functionality
 - `analysis`: these are tables/triggers etc for the analysis functionality
 - `userlayer`: these are tables/triggers etc for the data importing functionality

 The optional upgrade is done a modular setup with these modules:
 - `sample`: these are tables/triggers etc for the sample view functionality (same as http://demo.oskari.org page). Nb! This module can override some configs etc on your database. 
 
The default non-core module settings are defined in `oskari.properties` and can be overridden in `oskari-ext.properties`:

    # mark any addition module property tokens so we can check/add them automatically
    db.additional.modules=myplaces,analysis,userlayer

Each module keeps track of it's state using a database table named `oskari_status_[module]`. The core database status is tracked 
in table named `oskari_status`. Each module can also have their own datasource which needs to be accessible via JNDI. By default 
a common datasource is used (`jdbc/OskariPool`).

The upgrade scripts can be found in Github:
 - SQL: https://github.com/oskariorg/oskari-server/tree/develop/content-resources/src/main/resources/flyway
 - Java: https://github.com/oskariorg/oskari-server/tree/develop/content-resources/src/main/java/flyway

## Troubleshooting

Oskari logs a message (with log level `info`) `"Oskari-map checking DB status"` when the migration starts. When the core
 database has been migrated successfully, you should see a message `"Oskari core DB migrated successfully"`. After this 
 any configured modules are migrated. After each module migration the log should show a success message for that module 
 (`"[module] DB migrated successfully"`). If the core database migration fails for any reason, the message 
 `"DB migration for Oskari core failed!"` is logged with stacktrace detailing the error. The same is true with any module
 with message `"DB migration for module [module] failed!"`. Problems need to be addressed case-by-case so the stack trace 
 on error is the only tool that can be provided. Commonly known issues are listed in [Writing upgrade scripts](upgrade_scripts) document. 
 If any error occurs the migration will stop and the database status can be seen on the database status table for the module in question.
  On next startup the migration will resume from the version that caused the error.

The database tables show migrations that have been run successfully, for example `oskari_status_userlayer` looks like this:

<style>
  .tableWrapper {
    overflow: auto;
  }  
  .dbtable th {
    background: #CCC;
  }
  .dbtable th, .dbtable td {
    padding : 5px;
    border-right : 1px dotted black;
  }
  .dbtable tr:nth-child(even) {
    background: #f5f5f5;
  }
  .dbtable tr:nth-child(odd) {
    background: #FFF;
  }
</style>

<div class="tableWrapper">
    <table class="dbtable">
      <tr>
        <th>version_rank</th>
        <th>installed_rank</th>
        <th>version</th>
        <th>description</th>
        <th>type</th>
        <th>script</th>
        <th>checksum</th>
        <th>installed_by</th>
        <th>installed_on</th>
        <th>execution_time</th>
        <th>success</th>
      </tr>
      <tr class="ReportDetailsEvenDataRow">
        <td>1</td>
        <td>1</td>
        <td>0.1</td>
        <td>&lt;&lt; Flyway Baseline &gt;&gt;</td>
        <td>BASELINE</td>
        <td>&lt;&lt; Flyway Baseline &gt;&gt;</td>
        <td> </td>
        <td>postgres</td>
        <td>2015-06-25 15:25:05.949</td>
        <td>0</td>
        <td>t</td>
      </tr>
      <tr class="ReportDetailsOddDataRow">
        <td>2</td>
        <td>2</td>
        <td>1.0</td>
        <td>create-tables</td>
        <td>SQL</td>
        <td>V1_0\__create-tables.sql</td>
        <td>1112871463</td>
        <td>postgres</td>
        <td>2015-06-25 16:29:18.299</td>
        <td>40</td>
        <td>t</td>
      </tr>
      <tr class="ReportDetailsEvenDataRow">
        <td>3</td>
        <td>3</td>
        <td>1.0.1</td>
        <td>create triggers</td>
        <td>SQL</td>
        <td>V1_0_1\__create_triggers.sql</td>
        <td>668818731</td>
        <td>postgres</td>
        <td>2015-06-25 16:29:18.354</td>
        <td>26</td>
        <td>t</td>
      </tr>
      <tr class="ReportDetailsOddDataRow">
        <td>4</td>
        <td>4</td>
        <td>1.0.2</td>
        <td>Insert id for userlayerdata</td>
        <td>JDBC</td>
        <td>flyway.userlayer.V1_0_2\__Insert_id_for_userlayerdata</td>
        <td> </td>
        <td>postgres</td>
        <td>2015-06-25 16:53:00.717</td>
        <td>4</td>
        <td>t</td>
      </tr>
    </table>
</div>

This shows that:
 - the database has been initialized with version 0.1
 - SQL script `V1_0__create-tables.sql` has been run that by description creates tables - bringing the database version to 1.0
 - SQL script `V1_0_1__create_triggers.sql` has been run that by description creates database triggers - bringing the database version to 1.0.1
 - Java upgrade has been performed that by descriptions inserts some id for userlayerdata - resulting the database version 1.0.2

The next script that updates the `userlayer` module needs to be named with a bigger version number for example `V1_0_3__upgrade.sql` or `V1_1__upgrade.sql`.
Versions can technically skip from 1.0 to 37.2.26 with no issues, but the version should follow the software version as convention.

### Note! Database locking

When flyway begins the migration it starts a database transaction that locks the status table. If the migration takes a long time or is broken and you decide to 
kill the server before the migration is done the status table lock will remain. This kind of lock can be removed manually like this in Postgres 9.3:

1) Create a view that lists the locked tables

    CREATE VIEW blocking_procs AS
    SELECT 
      kl.pid as blocking_pid,
      ka.usename as blocking_user,
      ka.query as blocking_query,
      bl.pid as blocked_pid,
      a.usename as blocked_user, 
      a.query as blocked_query, 
      to_char(age(now(), a.query_start),'HH24h:MIm:SSs') as age
    FROM pg_catalog.pg_locks bl
      JOIN pg_catalog.pg_stat_activity a 
      ON bl.pid = a.pid
      JOIN pg_catalog.pg_locks kl 
      ON bl.locktype = kl.locktype
        and bl.database is not distinct from kl.database
        and bl.relation is not distinct from kl.relation
        and bl.page is not distinct from kl.page
        and bl.tuple is not distinct from kl.tuple
        and bl.virtualxid is not distinct from kl.virtualxid
        and bl.transactionid is not distinct from kl.transactionid
        and bl.classid is not distinct from kl.classid
        and bl.objid is not distinct from kl.objid
        and bl.objsubid is not distinct from kl.objsubid
        and bl.pid <> kl.pid 
      JOIN pg_catalog.pg_stat_activity ka 
      ON kl.pid = ka.pid
    WHERE kl.granted and not bl.granted
    ORDER BY a.query_start;

2) List the locks

    SELECT * FROM blocking_procs;

3) Kill the process that is holding the lock:

    SELECT pg_terminate_backend([blocking_pid]);

When your server starts and logs the "checking DB status" message and seems stuck there you might have this kind of lock in the database.
If you see the "migrated successfully" message for each module, then it's something else.

## Advanced: upgrade application specific database/data

Any customized application can setup the automatic migration by adding some configurations in `oskari-ext.properties` and 
providing the application specific upgrade scripts. Applications are treated as modules that can opt-in on using the
 automatic upgrade by defining a module in `oskari-ext.properties` (here we add a module called `myapplication`):

    db.additional.modules=myplaces,analysis,userlayer,myapplication
    
By default a modules upgrade scripts are discovered from classpath in location `/flyway/[module]`. This includes both SQL 
and Java upgrade-files so for Java the package needs to be `flyway.module`. If you want to change the default script location or 
provide alternatives, you can specify a comma-separated list in `oskari-ext.properties`:

    db.myapplication.script.locations=/flyway/myapplication,/upgrade/scripts/in/here/also

Note! If you define a custom module it needs to have at least one upgrade script (in each script location). 
Otherwise Flyway will log it as an error. Instructions for writing scripts can be found in the
 [Writing upgrade scripts](upgrade_scripts) document.

If the application uses another datasource than the default you need to configure it with `oskari-ext.properties`:

    db.myapplication.jndi.name=jdbc/MyApplicationDS
    db.myapplication.url=[db url]
    db.myapplication.username=[db user]
    db.myapplication.password=[db pass]
    
If you want to use another table name than `oskari_status_[module]` you can override it with this property:

    db.myapplication.status_table=my_status_table_name


### Examples

#### ASDI
 
In ASDI myplaces, analysis or userlayers are not needed so oskari-ext.properties defines only the application specific module.
This means that the database for myplaces, analysis and userlayers are not created when starting the application:

    db.additional.modules=asdi
    
Modules can be added when the functionality is needed so when `myplaces` functionality is added to the application the
 properties can be updated and on the next startup the `myplaces` database will be initialized and migrated up to date:
    
    db.additional.modules=asdi, myplaces

ASDI also has an example for modifying the views when a new feature (frontend bundle) is added or zoomlevels are tuned: 
https://github.com/arctic-sdi/oskari-server-extensions/tree/develop/server-extension/src/main/java/flyway/asdi

## Pre 1.31.0 manual upgrades 

The database needs to be updated manually to a state of version 1.30.x. After this the automatic upgrades kicks in,
 BUT expects the manual upgrades have been done until version 1.30.x. 

Database upgrade SQL scripts are located under `oskari-server/content-resources/src/main/resources/sql/upgrade/{version}`. SQL scripts can also be found behind these links in github:
- https://github.com/oskariorg/oskari-server/tree/master/content-resources/src/main/resources/sql/upgrade
- https://github.com/oskariorg/oskari-server/tree/develop/content-resources/src/main/resources/sql/upgrade

There's also `node.js` based upgrade tool under `oskari-server/content-resources/db-upgrade` which is mainly used for updating database content, for instance for adding plugins to the default view.
This is replaced by the Java upgrades on Oskari 1.31.0.

Upgrade scripts can also update content on the database so use caution and check them before running. 
You can also ask if you don't know how it will affect your system.

Release notes on `oskari-server` root are also worth checking out and if anything is broken, please tell us so we can fix it/add documentation.

### Upgrade instructions for version 1.17 maplayers refactoring


1) Run SQLs in oskari-server\content-resources\src\main\resources\sql\upgrade\1.17\oskari_maplayer.sql

2) Go to "oskari-server\content-resources\db-upgrade"

3) Modify config.js to match your database settings (see template file config.js.example)

4) Run "SCRIPT=oskari_maplayers_migration node app.js"

5) Things to check for successful migration:
* Each maplayer in portti_maplayer should now be found in oskari_maplayer
* oskari_maplayer should now also contain base/grouplayers that were previously found in portti_layerclass
* oskari_layergroup should now contain all organizations from portti_layerclass, but NOT base/grouplayers from portti_layerclass
* inspirethemes are now linked for maplayer via a linking table oskari_maplayer_themes (layers can belong to multiple themes on db level - not fully implemented throughout the system)are located under `oskari-server/docs/upgrade/1.17.md`
