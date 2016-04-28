# Authentication in oskari-server

This document describes how to setup an authentication for oskari-server.

## Database based custom authentication

`fi.nls.oskari.map.servlet.OskariRequestFilter` under `oskari-server/servlet-map` can handle setting principal in http request based on http-parameter.
It uses `UserService.login(username, password)` method to check password. Check the class `fi.nls.oskari.user.DatabaseUserService` (under `oskari-server/service-users`)
for reference or implement your own. The custom authentication is enabled by default. To have for example JAAS determine the user principal you can
disable it by adding `oskari.request.handlePrincipal=false` to `oskari-ext.properties`.

The user credentials are stored in database table `oskari_jaas_users`.

## Database based JAAS

Add property `oskari.request.handlePrincipal=false` to `oskari-ext.properties` to let JAAS handle request principal.

The user credentials are stored in database table `oskari_jaas_users`.

### 1. Build webapp-map

Use the profile `jetty-jaas` for Jetty 8 Hightide:

    mvn clean install -Pjetty-jaas


Use the profile `jetty9-jaas` for Jetty 9:

    mvn clean install -Pjetty9-jaas

### 2. Setup the server

Enable JAAS in Jetty 8 Hightide:

a) Copy `jetty8-login.conf` from `oskari-server/webapp-map/external/jetty8-login.conf` to `{JETTY_HOME}/etc/login.conf`

b) Ensure `dbJNDIName` in `{JETTY_HOME}/etc/login.conf` is the used DB Pool, the default value is `jdbc/OskariPool`

c) Copy `jetty-jaas.xml` from `oskari-server/webapp-map/external/jetty-jaas.xml` to `{JETTY_HOME}/etc/jetty-jaas.xml`

d) Ensure 'jetty-jaas.xml' is included in `{JETTY_HOME}/start.ini`

Enable JAAS in Jetty 9:

a) Copy `jetty9-login.conf` from `oskari-server/webapp-map/external/jetty9-login.conf` to `{JETTY_HOME}/etc/login.conf`

b) Ensure `dbJNDIName` in `{JETTY_HOME}/etc/login.conf` is the used DB Pool, the default value is `jdbc/OskariPool`

c) Enable JAAS by running:

    java -jar start.jar --add-to-startd=jaas

d) Ensure `{JETTY_HOME}/start.d/jaas.ini` contains the correct path to `login.conf`

### Common mistakes

Error: _java.lang.ClassNotFoundException: org.eclipse.jetty.plus.jaas.JAASLoginService_

  Compiled using 'jetty-jaas' maven profile and deployed to Jetty 9. Compile again with the 'jetty9-jaas' maven profile and deploy again.

Error: _java.lang.ClassNotFoundException: org.eclipse.jetty.jaas.JAASLoginService_

  Compiled using 'jetty9-jaas' maven profile and deployed to Jetty 8 Hightide. Compile again with the 'jetty-jaas' maven profile and deploy again.

Error: _Error creating db content!_

  Check username and password are defined in `oskari-server/webapp-map/target/oskari-map/WEB-INF/jetty-env.xml`, if these are [username] and [password]. Add the correct credentails to `oskari-server/servlet-map/filter/filter-base.properties` and compile again.


## LDAP based JAAS

Add property `oskari.request.handlePrincipal=false` to `oskari-ext.properties` to let JAAS handle request principal.

### 1. Build webapp-map

Use the profile jetty-ldap-jaas:

    mvn clean install -Pjetty-ldap-jaas

### 2. Setup the server

Enable LDAP-JAAS in Jetty 8 Hightide:

a) Copy `jetty8-ldap-login.conf` from `oskari-server/webapp-map/external/jetty8-ldap-login.conf` to `{JETTY_HOME}/etc/login.conf`

b) Modify `{JETTY_HOME}/etc/login.conf` to match your LDAP configuration using the field marked with {{key}}

c) Copy `jetty-jaas.xml` from `oskari-server/webapp-map/external/jetty-jaas.xml` to `{JETTY_HOME}/etc/jetty-jaas.xml`

d) Ensure 'jetty-jaas.xml' is included in `{JETTY_HOME}/start.ini`

Enable LDAP-JAAS in Jetty 9:

a) Copy `jetty9-ldap-login.conf` from `oskari-server/webapp-map/external/jetty9-ldap-login.conf` to `{JETTY_HOME}/etc/login.conf`

b) Modify `{JETTY_HOME}/etc/login.conf` to match your LDAP configuration using the field marked with {{key}}

c) Enable JAAS by running:

    java -jar start.jar --add-to-startd=jaas

d) Ensure `{JETTY_HOME}/start.d/jaas.ini` contains the correct path to `login.conf`


### Adding new users based on external authentication

`fi.nls.oskari.map.servlet.PrincipalAuthenticationFilter` tries to add users to Oskari database based on information in the request by default.
To disable this add `auth.add.missing.users=false` to `oskari-ext.properties`. The users will have:
 - username as `request.getUserPrincipal().getName()`
 - first- and lastname is not set
 - uuid is generated automatically.
 - roles are mapped using `request.isUserInRole("{{role name}}")`

The role mapping is by default done against role names specified in oskari_roles, but can be mapped to external role name with a database table
 `oskari_role_external_mapping`. Set the role_id to point to role in oskari_roles and name to have the external role name.