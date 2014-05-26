# Upgrading

Database upgrade SQL scripts are located under `oskari-server/content-resources/src/main/resources/sql/upgrade/{version}`. There's also `node.js` based upgrade tool under `oskari-server/content-resources/db-upgrade` which is mainly used for updating database content, for instance for adding plugins to the default view.

Additional upgrade instuctions are located under `oskari-server/docs/upgrade/{version}.md`

Upgrade scripts can also update content on the database so use caution and check them before running. You can also ask if you dont know how it will affect your system.

Release notes on `oskari-server` root are also worth checking out and if anything is broken, please tell us so we can fix it/add documentation.