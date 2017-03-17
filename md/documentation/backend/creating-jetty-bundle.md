
# Initial setup or how the Jetty bundle was built

1) Download Jetty as zip from http://download.eclipse.org/jetty/ -> stable-8 (tested with 8.1.16)

Unzip to a location on your computer. The location will be referenced as {JETTY_HOME}.

2) Cleanup the initial-content:

- Remove files under {JETTY_HOME}/contexts/
- Remove files under {JETTY_HOME}/webapps/
- Remove {JETTY_HOME}/contexts-available
- Remove {JETTY_HOME}/javadoc
- Remove {JETTY_HOME}/overlays

3) Add the PostgreSQL driver (and optional JNDI support)

- Download the driver .jar-file from https://jdbc.postgresql.org/download.html (tested withJDBC41 Postgresql Driver, Version 9.4-1201)
- Place the driver in {JETTY_HOME}/lib/ext/[postgresql-9.4-1201.jdbc41.jar]
- (OPTIONAL) Add "jndi" to the OPTIONS-list in {JETTY_HOME}/start.ini

4) Add configuration to serve Oskari frontend files

- add oskari-front.xml to {JETTY_HOME}/contexts/
- run 'git clone https://github.com/oskariorg/oskari-frontend' in {JETTY_HOME}
- after clone you have for example a file in {JETTY_HOME}/oskari/ReleaseNotes.md
- optionally modify 'resourceBase' in oskari-front.xml to point to a location where Oskari frontend files are located

5) Configuring oskari-map as root webapp

- add oskari-map.xml to {JETTY_HOME}/contexts/
- add oskari-ext.properties to {JETTY_HOME}/resources/
- (OPTIONAL, requires JNDI support in step 3) configure the database connection parameters (user/password) for OskariPool in oskari-map.xml
- NOTE! even if JNDI pool has been configured the same connection params are needed in oskari-ext.properties: the database creation requires this dual configuration for now.

6) (OPTIONAL) Configure JAAS for login functionality

- requires JNDI support in step 3
- add jetty-jaas-oskari.xml to {JETTY_HOME}/resources/
- add oskarirealm.conf to {JETTY_HOME}/resources/
- modify {JETTY_HOME}/start.ini and add a reference to configuration file 'resources/jetty-jaas-oskari.xml'
- modify {JETTY_HOME}/contexts/oskari-map.xml to include a securityHandler for JAAS (uncomment the segment)

7) (OPTIONAL) Install and start Redis (required by transport and printout)

- Download Redis from http://redis.io/download
- Start redis-server with default config (localhost:6379)
- (optional, inherited from oskari-ext.properties if not present) add transport-ext.properties to {JETTY_HOME}/resources/

8) (OPTIONAL) Install geoserver (required for my places/userlayers/analysis)

- Download geoserver http://geoserver.org/release/2.5.2/ -> Web archive (.war-file)
- Unzip the downloaded war-file (produces a folder geoserver with for example folder WEB-INF inside)
- Copy the folder to {JETTY_HOME}/webapps/geoserver

- Download WPS-plugin http://sourceforge.net/projects/geoserver/files/GeoServer/2.5.2/extensions/ -> geoserver-2.5.2-wps-plugin.zip
- Unzip the plugins package to {JETTY_HOME}/webapps/geoserver/WEB-INF/lib

- Check 'How to update backend code' above in this document (part To update geoserver extensions)

- Preconfigured Geoserver data dir is available and pre-configured for use in {JETTY_HOME}/geoserver_data. This includes SLDs for myplaces/analysis/userlayers and configurations for the default database values needed by these services.

9) Start the Jetty by running the command in {JETTY_HOME}

	java -jar start.jar

This creates the basic database structure (if it doesn't exist) with initial content based on a json file in webapp-map resources.
