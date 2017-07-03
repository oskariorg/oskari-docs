# Oskari users

Users in Oskari are described with a few attributes listed below:

![User table](/images/backend/userUML.png)
![Role table](/images/backend/roleUML.png)

The datasource for users can be configured to read and manage users using JSON, SAML etc, but default to the core database for Oskari.
Permissions for resources are mapped using roles and user-specific content uses the UUID to identify the user.

TODO: database tables and description/use cases for UserService implementations.

## User registration

A simple user registration form has been added to Oskari 1.39 version that needs to be activated by configuration (see details below).
This results in a "register" link being added under the login form on the map-page. The current register pages are very simple with alert notifications, but can be customized.

![Registration form](/images/backend/user.register.png)

After filling in the register form the user will receive a mail with a link to complete the registration:

![Mail to set password](/images/backend/user.register.mail.png)

Which leads to a page for setting a password:

![Password change](/images/backend/user.register.changepw.png)

After registration the user can request a password reset ("forgot password" feature):
![Request reset](/images/backend/user.register.forgotpw.png)

Or modify the user information:

![Modify user](/images/backend/user.register.modify.png)

User registration for Oskari can be enabled by modifying oskari-ext.properties:

    allow.registration=true
    oskari.email.sender=<sender@domain.com>
    oskari.email.host=<smtp.domain.com>

If you are running an oskari-server-extension you need to also add the dependency for the code:

    <groupId>fi.nls.oskari.service</groupId>
    <artifactId>oskari-control-users</artifactId>

The functionality is mostly contained under [oskari-server/control-users](https://github.com/oskariorg/oskari-server/tree/develop/control-users) with JSPs that can be overridden
in oskari-server-extensions using the same filename as the original. There are also localizations for the user registration that can be overridden with [locale/messages-ext.properties](https://github.com/oskariorg/oskari-server/blob/develop/servlet-map/src/main/resources/locale/messages.properties) files in the server classpath.

Note! User registration has been tested/implemented only for the case where users are in the Oskari database. Not for SAML logins etc.
