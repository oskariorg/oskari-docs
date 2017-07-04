# Oskari users

Users in Oskari are described with a few attributes listed below:

![User table](/images/backend/userUML.png)
![Role table](/images/backend/roleUML.png)

The datasource for users can be configured to read and manage users using JSON, SAML etc, but default to the core database for Oskari. The Java-interface for managing users is `fi.nls.oskari.service.UserService` under the service-base Maven module with `fi.nls.oskari.user.DatabaseUserService` under service-users Maven module as the reference implementation.

Permissions for resources are mapped using roles and user-specific content uses the UUID to link the content with the user.

TODO: description/use cases for UserService implementations.

## User registration

Oskari includes a simple user registration functionality that needs to be activated
 by configuration (see details below). This results in a "register" link being
  shown under the login form on the default geoportal-page and also enables the
  registration backend to accept requests.

The registration pages can be customized like any other JSP-file in Oskari and
 the emails sent by Oskari can also be customized.

### Registration form

 The first step of registration is just asking for the users email. This will always
 respond by saying an email has been sent to the address. The only error it will
 show if the email is not valid or if the server can detect that the mail was not sent.

![Registration form](/images/backend/user.register.png)

The mail the user receives has two options:
- if the email is already registered to an existing user - a message with password reminder link is sent.
- if the email is new the user receives a message with a link that can be used to access a form for user details.

### Completing the user profile

Once the user clicks on the email link the token included in the link is validated.
If the link token has expired or is unknown the first step of registration is
 shown with a message about expired link. The user can start the registration from the beginning.

 On most cases the user is presented with a form to complete the registration:

![Complete user profile](/images/backend/user.register.new.user.png)

As usernames are used to link the user password to user details it needs to be unique.
This is checked while the user is filling the form. The password strength requirements
are based on the server configuration. They can be customized by configuration.

After the user has completed the profile the user can log in to the geoportal.

### Password reset

Users can request a link for setting a new password for the account:

![Request reset](/images/backend/user.register.forgotpw.png)

For logged in users the email is pre-filled. For guest users the mail the user
receives has two options:
- if the email is new the user receives a message saying that there is no account for the email and a link to the registration page.
- if the email is already registered to an existing user - a link to set the password is sent:

![Password change](/images/backend/user.register.changepw.png)

### Modify user details

Currently only the name can be changed as changing the email would require a
mail to be sent to check the email and usernames are problematic since they are
used to map passwords to users.

![Modify user](/images/backend/user.register.modify.png)

### Configuration options

User registration for Oskari can be enabled by modifying `oskari-ext.properties`:

    allow.registration=true
    oskari.email.sender=<sender@domain.com>
    oskari.email.host=<smtp.domain.com>

The password requirement can be configured with:

    # min length for user password
    user.passwd.length=8
    # Require lower and UPPER chars
    user.passwd.case=true
    # Number of days that registration/passwd recover links are valid
    oskari.email.link.expirytime=2

If you are running an `oskari-server-extension` you need to also add the dependency for the code:

    <dependency>
        <groupId>fi.nls.oskari.service</groupId>
        <artifactId>oskari-control-users</artifactId>
        <version>${oskari.version}</version>
    </dependency>

The functionality is mostly contained under [oskari-server/control-users](https://github.com/oskariorg/oskari-server/tree/develop/control-users) with JSPs that can be overridden
in `oskari-server-extensions` using the same filename as the original. There are also localizations for the user registration that can be overridden with [locale/messages-ext.properties](https://github.com/oskariorg/oskari-server/blob/develop/servlet-map/src/main/resources/locale/messages.properties) files in the server classpath (like `jetty/resources/locale/messages-ext.properties`).

To customize email-templates configure `oskari-ext.properties` (add files in classpath for example under `jetty/resources/templates`):

    # defaults
    # on registration init
    oskari.email.registration.tpl=/templates/registration_email.html
    # on registration init if there's already a user account with the email
    oskari.email.exists.tpl=/templates/registration_email_exists.html
    # on "forgot my password"
    oskari.email.passwordrecovery.tpl=/templates/user_passwordreset_email.html
    # on "forgot my password" when there's no user account associated with the email
    oskari.email.passwordrecovery.noaccount.tpl=/templates/user_passwordreset_email_new_user.html

    # you can specify localized versions by adding the language code at the end of the property key
    oskari.email.registration.tpl.fi=/templates/registration_email_finnish_version.html

The default templates are stored in `control-users/src/main/resources/fi/nls/oskari/control/users/service`.
 The templates receive variables for:

- URL to continue the process (`link_to_continue`)
- number of days before the token expires (`days_to_expire`)

Tokens with expiration dates are tracked in the `oskari_users_pending` database table.
If an email has an existing token it will be replaced with a new one with
 new expiration date so one email can only have one token at a time. This means
 that for example registration links will automatically expire if the user uses
 the password reminder.


Note! User registration has been tested/implemented only for the case where users are in the Oskari database. Not for SAML logins etc.

## Known issues

If you have problems having the mail sent first try to send a mail fron the server
with telnet:

    telnet [mail server] [port]
    MAIL FROM: noreply@mysite.org
    RCPT TO: someuser@somedomain.com

From terminal it might look like this:

    [user@server ~]$ telnet [mail server] 25
    Trying [mail server]...
    Connected to [mail server].
    Escape character is '^]'.
    220 [mail server] ESMTP Postfix (Ubuntu)
    MAIL FROM: noreply@mysite.org
    250 2.1.0 Ok
    RCPT TO: someuser@somedomain.com
    454 4.7.1 <someuser@somedomain.com>: Relay access denied

In this case the mail server doesn't allow mails to be sent to the recipient and
there's nothing you can do but ask the hosting party to loosen the restrictions.
The good news is that the connection to the server was successful so there's no
 firewall blocking the connection.

If everything is good to go with the mail server and you still have problems sending mails
you should check the Oskari logs for more information about the issue.

On one instance adding a javax.mail implementation manually was required,
but it should be included in the Jetty-bundle. If this is the case you can add the
 jar-file to jetty/lib/ext folder (http://mvnrepository.com/artifact/com.sun.mail/javax.mail/1.5.4).
