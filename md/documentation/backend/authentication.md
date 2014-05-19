# Authentication in oskari-server

This document describes how to setup a authentication for oskari-server.

## Database based custom authentication

`fi.nls.oskari.map.servlet.OskariRequestFilter` under `oskari-server/servlet-map` can handle setting principal in http request based on http-parameter.
It uses `UserService.login(username, password)` method to check password. Check the class `fi.nls.oskari.user.DatabaseUserService` (under `oskari-server/service-users`)
for reference or implement your own. The custom authentication is by default turned. To have for example JAAS determine the user principal you can
disable it by adding `oskari.request.handlePrincipal=false` to `oskari-ext.properties`.

The user credentials are stored in database table `oskari_jaas_users`.

## Database based JAAS

Add property `oskari.request.handlePrincipal=false` to `oskari-ext.properties` to let JAAS handle request principal.

The user credentials are stored in database table `oskari_jaas_users`.

### 1. Build webapp-map

Use the profile jetty-jaas:

    mvn clean install -Pjetty-jaas

### 2. Setup the server

For Jetty 8 Hightide:

a) Copy the `jndi-login.conf` from `oskari-server/webapp-map/target/oskari-map/WEB-INF/jndi-login.conf` to `{JETTY_HOME}/etc/jndi-login.conf`

b) Check that the class referenced in `jndi-login.conf` is `org.eclipse.jetty.plus.jaas.spi.DataSourceLoginModule`

c) Check that the class referenced in `jetty-env.xml` securityHandler is `org.eclipse.jetty.plus.jaas.JAASLoginService`
- If not -> change the template in `oskari-server\webapp-map\env\jetty-jaas\WEB-INF` and compile again

d) Setup Jetty JAAS support by modifying `{JETTY_HOME}/etc/jetty-jaas.xml` and add the following:

    <Call class="java.lang.System" name="setProperty">
      <Arg>java.security.auth.login.config</Arg>
      <Arg><SystemProperty name="jetty.home" default="." />/etc/jndi-login.conf</Arg>
    </Call>

    <Call name="addBean">
      <Arg>
          <New class="org.eclipse.jetty.plus.jaas.JAASLoginService">
           <Set name="Name">OskariRealm</Set>
           <Set name="LoginModuleName">oskariLoginModule</Set>
          </New>
      </Arg>
    </Call>

For jetty 9 it's basically the same but the class packages have dropped `plus`:

    org.eclipse.jetty.plus.jaas.JAASLoginService -> org.eclipse.jetty.jaas.JAASLoginService
    org.eclipse.jetty.plus.jaas.spi.DataSourceLoginModule -> org.eclipse.jetty.jaas.spi.DataSourceLoginModule

## LDAP based JAAS

Add property `oskari.request.handlePrincipal=false` to `oskari-ext.properties` to let JAAS handle request principal.

### 1. Build webapp-map

Use the profile jetty-ldap-jaas:

    mvn clean install -Pjetty-ldap-jaas

### 2. Setup the server

For Jetty 8 Hightide:

a) Copy the `jndi-login.conf` from `oskari-server/webapp-map/target/oskari-map/WEB-INF/jndi-login.conf` to `{JETTY_HOME}/etc/jndi-login.conf`

b) Check that the class referenced in `jndi-login.conf` is `org.eclipse.jetty.plus.jaas.spi.LdapLoginModule`
    and modify the content marked with {{key}} to match your LDAP

c) Check that the class referenced in `jetty-env.xml` securityHandler is `org.eclipse.jetty.plus.jaas.JAASLoginService`
- If not -> change the template in `oskari-server\webapp-map\env\jetty-ldap-jaas\WEB-INF` and compile again

d) Setup Jetty JAAS support by modifying `{JETTY_HOME}/etc/jetty-jaas.xml` and add the following:

    <Call class="java.lang.System" name="setProperty">
      <Arg>java.security.auth.login.config</Arg>
      <Arg><SystemProperty name="jetty.home" default="." />/etc/jndi-login.conf</Arg>
    </Call>

    <Call name="addBean">
      <Arg>
          <New class="org.eclipse.jetty.plus.jaas.JAASLoginService">
           <Set name="Name">OskariRealm</Set>
           <Set name="LoginModuleName">oskariLoginModule</Set>
          </New>
      </Arg>
    </Call>

For jetty 9 it's basically the same but the class packages have dropped `plus`:

    org.eclipse.jetty.plus.jaas.JAASLoginService -> org.eclipse.jetty.jaas.JAASLoginService
    org.eclipse.jetty.plus.jaas.spi.LdapLoginModule -> org.eclipse.jetty.jaas.spi.LdapLoginModule

