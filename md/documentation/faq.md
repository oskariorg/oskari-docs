# FAQ

##  Why are there no layers in a published map?

Check access rights. See [Oskari permissions](/documentation/backend/permissions)

##  Why there are broken tiles instead of my own places on the map?

Check that myplaces ajax url and namespace are properly configured.  See [enabling My Places](/documentation/backend/enabling-myplaces) (sections 3 & 7)

##  Why are the myplaces timestamps not updated?
	
Check that you have added the trigger on myplaces table. This needs to be run manually and can be found in `oskari-server/content-resources/src/main/resouces/sql/PostgreSQL/trigger-myplaces.sql`

## How can I build Oskari with a new version tag?

Run `mvn -N versions:set -DnewVersion={NEW-VERSION}` on oskari-server root. It updates the version for oskari-server/pom.xml and all the maven modules defined in its modules-tag.

## Transport doesn't draw all geometries in tiles?

Check that the layer's maxfeatures number is high enough in database. If the transport returns a tile, but some geometries are missing, usually its because there are more features than the maxfeatures count permits.

## There is a bug, what to do?

You found a bug? Can you repeat it? Yes: File a bug report at [GitHub issues](https://github.com/oskariorg/oskari-docs/issues). 

– Go to: [GitHub](https://github.com/oskariorg/oskari-docs/)
– Sign up
– Press New issue-button
– Include helpful information: Oskari version, browser, steps to reproduce the error
– Press Submit new issue-button

## Where can I find help with my Oskari issues?

All the discussion channels are listed [here](http://oskari.org/about). It is higly recomended to ask Oskari related issues by sending a query to [Oskari user mailing list](https://lists.osgeo.org/mailman/listinfo/oskari-user) or chat in [Oskari Gitter](https://gitter.im/oskariorg/chat).

## What skills do I need to use Oskari?

There is a list of different Oskari roles, you can find the requirements [here](community/roles.md).
