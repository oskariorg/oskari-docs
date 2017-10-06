# Authentication in oskari-server

Note! This document might contain old information as it was based on JAAS authentication that is no longer available out of the box.

This document describes how to setup an authentication for oskari-server.

## Database based custom authentication

`fi.nls.oskari.map.servlet.OskariRequestFilter` under `oskari-server/servlet-map` can handle setting principal in http request based on http-parameter.
It uses `UserService.login(username, password)` method to check password. Check the class `fi.nls.oskari.user.DatabaseUserService` (under `oskari-server/service-users`)
for reference or implement your own. The custom authentication is enabled by default. To have for example JAAS determine the user principal you can
disable it by adding `oskari.request.handlePrincipal=false` to `oskari-ext.properties`.

The user credentials are stored in database table `oskari_jaas_users`.

### Adding new users based on external authentication

`fi.nls.oskari.map.servlet.PrincipalAuthenticationFilter` tries to add users to Oskari database based on information in the request by default.
To disable this add `auth.add.missing.users=false` to `oskari-ext.properties`. The users will have:
 - username as `request.getUserPrincipal().getName()`
 - first- and lastname is not set
 - uuid is generated automatically.
 - roles are mapped using `request.isUserInRole("{{role name}}")`

The role mapping is by default done against role names specified in oskari_roles, but can be mapped to external role name with a database table
 `oskari_role_external_mapping`. Set the role_id to point to role in oskari_roles and name to have the external role name.
