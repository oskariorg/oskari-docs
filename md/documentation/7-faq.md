# FAQ for developers

## There is a bug, what to do?

You found a bug? Can you repeat it? Yes: File a bug report at [GitHub issues](https://github.com/oskariorg/oskari-docs/issues). 

- Go to: [GitHub](https://github.com/oskariorg/oskari-docs/)
- Sign up
- Press New issue-button
- Include helpful information: Oskari version, browser, steps to reproduce the error
- Press Submit new issue-button

## Where can I find help with my Oskari issues?

All the discussion channels are listed [here](http://oskari.org/about). It is higly recomended to ask Oskari related issues by sending a query to [Oskari user mailing list](https://lists.osgeo.org/mailman/listinfo/oskari-user) or chat in [Oskari Gitter](https://gitter.im/oskariorg/chat).

## What skills do I need to use Oskari?

There is a list of different Oskari roles, you can find the requirements [here](/community/roles).

## How do I set up Oskari?

Oskari is not a software you can set up by just pushing a execute button. It is a comprehensive setup that requires understanding about server side and different software libraries. The setup is also depending on the operating system and server environment. First go to [documentation](http://oskari.org/documentation) and get familiar with the components. Then ask if you need assistance!

## How to develop Oskari?

If you want to provide improvements to Oskari, here are some steps to do it:

1. Open the Oskari source code in your project. Remember to follow the guidelines and [How-to](/documentation/development/how-to-contribute). Share your plans also openly through [Oskari Roadmap in GitHub](https://github.com/oskariorg/oskari-docs/labels/roadmap), so other developers know what to you are up to.
2. Test and report bugs.
3. Discuss and ask support.
4. Remember that adding new features to Oskari main development line are discussed and decided by Oskarin PSC.  If the developed feature is not suitable for the main development line, it can be added as a Community Plugin. 
5. Remember to update your plugins and take care that they are compatible with the versioning of the main development line.

Optional: Join Joint Development Forum for Oskari and let's activate a joint development project. You'll receive support from the group and National Land Survey of Finland, were the technical support team is ready to tackle your questions and check your source code.

## How can I build Oskari with a new version tag?

Run `mvn -N versions:set -DnewVersion={NEW-VERSION}` on oskari-server root. It updates the version for oskari-server/pom.xml and all the maven modules defined in its modules-tag.

## Where to find Oskari's development roadmap?

Have you tried to find out what is happening next within Oskari development? Check out [Oskari in GitHub](https://github.com/oskariorg/oskari-docs/labels/roadmap) and issues tagged with “roadmap”. These issues have either been proposed or approved by Oskari Project Steering Committee (PSC) to go into the development roadmap.

The schedule for development depends on various issues, usually time and money. So if you want to know if some issue is coming to the next release, read the issue first and then if not clear, ask by commenting on the issue in GitHub or through [Gitter chat](https://gitter.im/oskariorg/chat). You can also contribute to the roadmap issues, always appreciated!

## How often Oskari needs updating?

Oskari is updated every now and then (approximately once in every 2-4 months) and it is very important to update as soon as possible, since the new version is always the best, most reliable and secure.

## Where are the release notes?

See [GitHub](https://github.com/oskariorg/oskari-frontend/blob/master/ReleaseNotes.md). Notice that you can view all previous release notes from the same page. Release notes will be posted to the audience also through the [Oskari user email list](https://lists.osgeo.org/mailman/listinfo/oskari-user), so go ahead and join the list so you know when to update. New releases are informed also via social media in Twitter and Gitter.

## How to change versions?

1) Update the oskari-frontend dependency in package.json for frontend
2) Update oskari.version property in pom.xml for server
3) Build new frontend and server as usual
4) See Migration Guide for any manual steps required between updating from your current version to the one you are updating to: https://github.com/oskariorg/oskari-server/blob/master/MigrationGuide.md
5) Check Release Notes on repositories for more information about changes:
- https://github.com/oskariorg/oskari-frontend/blob/master/ReleaseNotes.md
- https://github.com/oskariorg/oskari-server/blob/master/ReleaseNotes.md

The database schema and content is upgraded automatically when you start the newly build application. Read more about [automatic upgrades in Oskari](https://oskari.org/documentation/backend/upgrading).

## Handling dates and timestamps

- For database: Use column of type `timestamp with time zone`
- For Java: In general use `java.time.Instant`
- For interacting with database use `java.time.OffsetDateTime` with `ZoneOffset.UTC`
- For JSON: Use ISO string like `2022-05-16T10:40:33.594Z` (use `DateTimeFormatter.ISO_INSTANT`)
- For Javascript value objects: Use `Date`
- For rendering in the UI: Format only while rendering (not in model)

Also:
- Use NOT NULL in database for creation date with default value to current timestamp
- Prefer updating modification date in code rather than db triggers

# FAQ for users

## What is the Oskari license?

The source code for Oskari is open source. It is being kept flexible in order to broaden it with new components, use it with different service platforms and for changing the software libraries if needed. The UI supports multilingualism and there are already multiple languages translated. All source code is being published with MIT/EUPL licenses.

## How do I create embedded maps from Oskari?

If you don’t want to set up Oskari installation, don’t worry you can still enjoy the ride. You can build fancy & tailored map views based on Published maps functionality in Oskari. This requires an Oskari installation that has enabled the Published map functionality. If you are registered to the Oskari site you want to use, add the map layers you need to the map and click Published maps. Follow the instructions and embedd the iframe code you get in the end to your website. 

##  Why are there no layers in a embedded map?

Check access rights. It might be that users with guest-role (most of the people looking at embedded maps) don't have permission to see layers included in the embedded map. See [Oskari permissions](/documentation/backend/permissions)

## How do I tailor my embedded maps?

Embedded maps can be tweaked to be in contact with your web site and provide more information to users using code snippets called RPC (Remote Process Call). So you can get the map to talk with your site. See the [RPC example codes](http://oskari.org/examples/rpc-api/) or [follow the workshop example](http://oskari.org/documentation/examples/FOSS4G_2019/workshop).




