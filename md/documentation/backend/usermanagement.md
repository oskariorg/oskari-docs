# Oskari users

Users in Oskari are described with a few attributes listed below:

![User table](/images/backend/userUML.png)
![Role table](/images/backend/roleUML.png)

The datasource for users can be configured to read and manage users using JSON, SAML etc, but default to the core database for Oskari.
Permissions for resources are mapped using roles and user-specific content uses the user UUID to identify the user.

## User registration

User registration for Oskari can be enabled by modifying oskari-ext.properties:

    allow.registration=true
    oskari.email.sender=<sender@domain.com>
    oskari.email.host=<smtp.domain.com>

If you are running an oskari-server-extension you need to also add the dependency for the code:

    <groupId>fi.nls.oskari.service</groupId>
    <artifactId>oskari-control-users</artifactId>


This results in a "register" link being added under the login form on the map-page. The current register pages are very crude with alert notifications.
The functionality is mostly contained under [oskari-server/control-users](https://github.com/nls-oskari/oskari-server/tree/develop/control-users) with JSPs that can be overridden
in oskari-server-extensions using the same filename as the original. There are also localizations for the user registration that can be overridden with [locale/messages-ext.properties](https://github.com/nls-oskari/oskari-server/blob/develop/servlet-map/src/main/resources/locale/messages.properties) files in the server classpath.
