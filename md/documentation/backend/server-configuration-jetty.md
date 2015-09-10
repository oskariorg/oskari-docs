# Configuring Jetty Hightide 8.1.14 for Oskari

## Preconfigured Jetty

Preconfigured Jetty can be downloaded from [Download page](/download) to see the latest configurations

## Setting up Jetty Hightide 8.1.14

1) Download http://dist.codehaus.org/jetty/jetty-hightide-8.1.14/

2) unpack to selected location (referred as `{jetty.home}`)

3) Set default `jetty.port` for `jetty run` in `etc/jetty.xml` file

     <Call name="addConnector">
      <Arg>
          <New class="org.eclipse.jetty.server.nio.SelectChannelConnector">
            <Set name="host"><Property name="jetty.host" /></Set>
            <Set name="port"><Property name="jetty.port" default="8888"/></Set>

---------------------------------------------

### Setting up static frontend code to be served by Jetty

1) Go to Jetty static content webapp

    cd {jetty.home}\webapps\root

2) Get the frontend code from github:

    git clone https://github.com/nls-oskari/oskari.git

3) Rename the created oskari folder to Oskari

    mv oskari Oskari

---------------------------------------------


### OPTIONAL - Configure global database connection pool

This is optional since `webapp-map` can be built with profiles that configure connection pool inside the webapp and don't rely on global resource.

1) Download PostgreSQL JDBC driver jar-file and copy it to {jetty.home}/lib/jdbc

    http://jdbc.postgresql.org/download/postgresql-9.3-1100.jdbc4.jar

2) Add the following snippet in `{jetty.home}/etc/jetty.xml`:

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

3) Edit the previous snippet to include actual database properties specific for your environment.

# Startup

Startup Jetty  (`cmd.exe` in Windows)

    cd {jetty.home}
    java -jar start.jar

   (or start with proxy setup, if any  eg. java -jar start.jar -Dhttp.proxyHost=wwwp.xxx.xx -Dhttp.proxyPort=800 -Dhttp.nonProxyHosts="*.yyy.xx|*.foo.fi" --exec)

