# Writing upgrade scripts

## DONT's

- Don't modify an existing script once it's commited, flyway calculates checksum for scripts so any change in existing 
 script will result in a migration error.
- Don't link tables between migration modules. Modules are considered to be standalone and constraints between them
 are likely to cause problems.
- Be very careful when doing updates to database content. Other than registering new bundles to portti_bundle almost 
 any content-related updated should be done in an application module. F.ex. adding bundles to views etc are application
 specific updates.

## DO's

- Make sure the upgrade scripts have proper error handling. Database environments may vary as the content in the database. 
 It's always better to check things instead of assuming.

## Script naming
 
File naming is important since migration scripts are located and versioned by naming conventions:
 
- the names should start with capital `V`
- followed by `version` number that is greater than any existing script version and based on the Oskari/module/application version
- version and description is separated by double-undescore `__`
- `description`
- for SQL scripts the file extension is `.sql` and saved in a folder `/flyway/[module]`
- for Java upgrades the package needs to be `flyway.[module`] where core Oskari upgrades are `flyway.oskari`

In a basic maven setup this will result in files like these:
- `oskari-server/content-resouces/src/main/resources/flyway/oskari/V1_31_0__Adding_mycolumn_for_mytable.sql`
- `oskari-server/content-resouces/src/main/java/flyway/oskari/V1_31_1__Populating_mycolumn_from_CSV.java`

Existing scripts can be found in Github:

 - SQL: https://github.com/nls-oskari/oskari-server/tree/develop/content-resources/src/main/resources/flyway
 - Java: https://github.com/nls-oskari/oskari-server/tree/develop/content-resources/src/main/java/flyway
 
Application-specific upgrade example:
- Java: https://github.com/arctic-sdi/oskari-server-extensions/tree/develop/server-extension/src/main/java/flyway/asdi

Note the script locations can be changed by configuration as described in the [Upgrading](upgrading) document.

For more information:
- [Upgrading](upgrading) document
- Flyway documentation: http://flywaydb.org/
