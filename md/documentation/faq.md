# FAQ

##  Why are there no layers in a embedded map?

Check access rights. It might be that users with guest-role (most of the people looking at embedded maps) don't have permission to see layers included in the embedded map. See [Oskari permissions](/documentation/backend/permissions)

##  Why are the myplaces timestamps not updated?
	
Check that you have added the trigger on myplaces table. This needs to be run manually and can be found in `oskari-server/content-resources/src/main/resouces/sql/PostgreSQL/trigger-myplaces.sql`

## How can I build Oskari with a new version tag?

Run `mvn -N versions:set -DnewVersion={NEW-VERSION}` on oskari-server root. It updates the version for oskari-server/pom.xml and all the maven modules defined in its modules-tag.

## How do I create embedded maps from Oskari?

If you don’t want to set up Oskari installation, don’t worry you can still enjoy the ride. You can build fancy & tailored map views based on Published maps functionality in Oskari. This requires an Oskari installation that has enabled the Published map functionality. If you are registered to the Oskari site you want to use, add the map layers you need to the map and click Published maps. Follow the instructions and embedd the iframe code you get in the end to your website. 

## How do I tailor my embedded maps?

Embedded maps can be tweaked to be in contact with your web site and provide more information to users using code snippets called RPC (Remote Process Call). So you can get the map to talk with your site. See the [RPC example codes](http://oskari.org/examples/rpc-api/rpc_example.html) or [follow the workshop example](http://oskari.org/documentation/examples/FOSS4G_2019/workshop).

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

1. Open the Oskari source code in your project. Remember to follow the guidelines and [How-to-model](/documentation/development/how-to-contribute). Share your plans also openly through [Oskari Roadmap in GitHub](https://github.com/oskariorg/oskari-docs/labels/roadmap), so other developers know what to you are up to.
2. Test and report bugs.
3. Discuss and ask support.
4. Remember that adding new features to Oskari main development line are discussed and decided by Oskarin PSC.  If the developed feature is not suitable for the main development line, it can be added as a Community Plugin. 
5. Remember to update your plugins and take care that they are compatible with the versioning of the main development line.

Optional: Join Joint Development Forum for Oskari and let's activate a joint development project. You'll receive support from the group and National Land Survey of Finland, were the technical support team is ready to tackle your questions and check your source code.

## What is the Oskari license?

The source code for Oskari is open source. It is being kept flexible in order to broaden it with new components, use it with different service platforms and for changing the software libraries if needed. The UI supports multilingualism and there are already multiple languages translated. All source code is being published with MIT/EUPL licenses.

