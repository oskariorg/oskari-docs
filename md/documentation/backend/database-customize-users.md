# User management

The easiest way to add, edit or remove users and roles is using the admin functionality provided by the Oskari frontend bundle admin-users. For manually adding users the steps are:

### 1. Adding new users

Add a user to `oskari_users` table:

    INSERT INTO oskari_users(user_name, first_name, last_name, uuid) VALUES('username', 'Oskari', 'Olematon', 'fdsa-fdsa-fdsa-fdsa-fdsa');

For a user to be able to login (using the default database login) the users credentials must be added to the `oskari_jaas_users` database table. Add a user to `oskari_jaas_users` table for authentication:

    INSERT INTO oskari_jaas_users(login, password) VALUES('username', 'MD5:xyzxyzxyz...');

Note that username needs to match in these two tables. Passwords should be encrypted in the database table.
For more information see http://www.eclipse.org/jetty/documentation/current/configuring-security-secure-passwords.html
Note! oskari_users can store users that don't have credentials in oskari_jaas_users for example when using the SAML-login users are 
stored without credentials. This way users will have an internal id/uuid that can be used to link user content.

`oskari_jaas_users` is used for database based authentication only.

### 2. Adding new roles

Add a role to `oskari_roles` table:

    INSERT INTO oskari_roles(name) VALUES('MyRole');

### 3. Map users to roles

Add mapping to `oskari_role_oskari_user` table:

    INSERT INTO oskari_role_oskari_user(user_name, role_id) VALUES('username', (SELECT id FROM oskari_roles WHERE name = 'MyRole'));

### 4. Map permissions to roles

Add permission to `oskari_permission` table:

    INSERT INTO oskari_permission(oskari_resource_id, external_type, permission, external_id) values
    (<resource-id>, 'ROLE', 'VIEW_LAYER', (SELECT id FROM oskari_roles WHERE name = 'MyRole'));

Note that `<resource-id>` needs to point to an existing resource in `oskari-resource` table.
