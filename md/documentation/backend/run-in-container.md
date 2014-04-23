# Deploy Oskari to a servlet container

## Jetty

# Setting up Jetty Hightide 8.1.14
*TODO: Verify that this still works with new webapplication war - module*

1) Download http://dist.codehaus.org/jetty/jetty-hightide-8.1.14/

2) unpack to selected location (referred as `{jetty.home}`)

3) Configure database connection pool by adding the following snippet in `{jetty.home}/etc/jetty.xml`:
*TODO: This can be removed since jetty-env.xml in webapplication war - module already defines these (unless they need to be overwritten). jetty-env.xml is included in the war - package.*

    <New id="OskariPool" class="org.eclipse.jetty.plus.jndi.Resource">
       <Arg></Arg>
       <Arg>jdbc/OskariPool</Arg>
       <Arg>
          <New class="org.postgresql.ds.PGSimpleDataSource">
             <Set name="User">postgres</Set>
             <Set name="Password">[your pw]</Set>
             <Set name="DatabaseName">oskaridb</Set>
             <Set name="ServerName">localhost</Set>
             <Set name="PortNumber">5432</Set>
          </New>
       </Arg>
    </New>

4) Edit the previous snippet to include actual database properties specific for your environment
*TODO: Can be removed (see previous point)*

5) Download PostgreSQL JDBC driver jar-file and copy it to {jetty.home}/lib/jdbc
*TODO: Can be removed since PostgreSQL driver is already included in the war - package*

    http://jdbc.postgresql.org/download/postgresql-9.3-1100.jdbc4.jar

6) Set default `jetty.port` for `jetty run` in `etc/jetty.xml` file

     <Call name="addConnector">
      <Arg>
          <New class="org.eclipse.jetty.server.nio.SelectChannelConnector">
            <Set name="host"><Property name="jetty.host" /></Set>
            <Set name="port"><Property name="jetty.port" default="8888"/></Set>



---------------------------------------------

# Setting up static frontend code to be served by Jetty

1) Go to Jetty static content webapp

    cd {jetty.home}\webapps\root

2) Get the frontend code from github:

    git clone https://github.com/nls-oskari/oskari.git

3) Rename the created oskari folder to Oskari

    mv oskari Oskari

---------------------------------------------

# Setting up and packaging the oskari backend

1) Complete the *Quick Start* of [Running Oskari in standalone mode](/documentation/backend/standalonebackend)

2) Compile and package the servlet

    cd <work-dir>/oskari-server/webapplication
    mvn install

3) Copy the war package from under `<work-dir>/oskari-server/webapplication/target/` to `{jetty.home}/webapps`

4) Setup override properties for Oskari. Add an `oskari-ext.properties` in `{jetty.home}/resources/oskari-ext.properties` (`oskari.trustAllCerts/oskari.trustAllHosts` bypasses certificate errors on ssl requests):

Copy `oskari-server/servlet-map/src/main/resources/oskari.properties` to `{jetty.home}/resources/oskari-ext.properties`

Replace below property values in `.properties` file

    # set to true to get database populated with initial demo content
    oskari.init.db=false

    # true all ssl certs/hosts for debugging! configure certs on the server for production
    oskari.trustAllCerts=true
    # true all ssl certs/hosts for debugging! configure certs on the server for production
    oskari.trustAllHosts=true

    # url path to call for ajax requests/action routes
    oskari.ajax.url.prefix=/oskari-map/?

    # Supported locales, comma separated and default first
    oskari.locales=fi_FI,sv_SE,en_US

-------------------------------------------

# Startup application

1) Startup Jetty  (`cmd.exe` in Windows)

    cd {jetty.home}
    java -jar start.jar

   (or start with proxy setup, if any  eg. java -jar start.jar -Dhttp.proxyHost=wwwp.xxx.xx -Dhttp.proxyPort=800 -Dhttp.nonProxyHosts="*.yyy.xx|*.foo.fi" --exec)

2) Start application
   *http://localhost:8888/webapplication-<version>* in your browser, where version is the version number of oskari that you deployed. This is the same as the `war` - package name.

   You can login with username "user" and password "user" as a normal user or "admin"/"oskari" as an admin user.

## Tomcat
TBD
