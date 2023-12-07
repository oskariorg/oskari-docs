# Upgrading

When upgrading Oskari version the database schema might require upgrading as well. The upgrading and initialization of an empty database is
done automatically with migration scripts using http://flywaydb.org/.
This document describes the procedure and provides insight for debugging on possible error scenarios.

The migration happens when the webapp is started. The software version is recorded into the database and each
 upgrade script that is tagged/named with a later version than have been run before is executed in version sequence on startup
 and the current database status is updated so the next startup won't trigger the same migrations.

The upgrade is done with a modular setup with these default modules:   
 - `oskari`: this is the base database for Oskari
 - `myplaces`: these are tables/triggers etc for the my places functionality
 - `analysis`: these are tables/triggers etc for the analysis functionality
 - `userlayer`: these are tables/triggers etc for the data importing functionality

 Oskari-based server-extensions can also use a migration module to initialize the database content and applications setups.
 For example the sample-server-extension uses the `example` module to initialize a couple dataproviders, default users, an application specific bundle, application setups (collection of bundles to be shown as geoportal for the user) and layers to the database as content.

The default non-core module settings are defined in `oskari.properties` and can be overridden in `oskari-ext.properties`:

    # mark any addition module property tokens so we can check/add them automatically
    db.additional.modules=myplaces,analysis,userlayer

Each module keeps track of it's state using a database table named `oskari_status_[module]`. The core database status is tracked
in table named `oskari_status`. Each module can also have their own datasource providing the database connections. By default a common datasource is used that is configured in oskari-ext.properties file:
```
db.url=jdbc:postgresql://localhost:5432/oskaridb
```

The built-in migration scripts can be found in Github:
 - SQL: https://github.com/oskariorg/oskari-server/tree/develop/content-resources/src/main/resources/flyway
 - Java: https://github.com/oskariorg/oskari-server/tree/develop/content-resources/src/main/java/flyway

 For the sample-server-extension they are in the application repository:
- SQL: https://github.com/oskariorg/sample-server-extension/tree/master/app-resources/src/main/resources/flyway/example
- Java: https://github.com/oskariorg/sample-server-extension/tree/master/app-resources/src/main/java/flyway/example

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

    db.additional.modules=myplaces, analysis, userlayer, myapplication

By default a modules upgrade scripts are discovered from classpath in location `/flyway/[module]`. This includes both SQL
and Java upgrade-files so for Java the package needs to be `flyway.[module]`. If you want to change the default script location or 
provide alternatives, you can specify a comma-separated list in `oskari-ext.properties`:

    db.myapplication.script.locations=/flyway/myapplication,/upgrade/scripts/in/here/also

Note! If you define a custom module it needs to have at least one upgrade script.
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
https://github.com/arctic-sdi/oskari-server-extensions/tree/develop/asdi-resources/src/main/java/flyway
