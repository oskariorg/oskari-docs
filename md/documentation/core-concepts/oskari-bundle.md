# Oskari bundle

A bundle is a component in an Oskari application. A bundle is a selection of [Oskari classes](/documentation/core-concepts/oskari-class) which form a component that offers additional functionality for an application. A bundle can offer multiple implementations for a functionality which can then be divided into smaller packages for different application setups. Packages can be used to offer a multiple views for the same functionality for example search functionality as a small on-map textfield or a window-like UI (see Tile/Flyout) for the same functionality. For a short introduction see [create your own bundle](/guides/quick-start/create-your-own-bundle).

## Directory structure

See [here](/documentation/directory-structure) for info about structure and conventions.

## Implementation

Bundles implementation files should be located under the `/bundles` folder. If the bundle has a BundleInstance (ie. something that is started/instantiated when the bundle is played) it is usually defined in a file called `instance.js`, but this is not enforced and any file referenced in bundle definition (`bundle.js`) can be used. The bundle doesn't need to have an instance and can be just used to import dependency files that can be instantiated elsewhere. Usually you want to implement a BundleInstance since you can think of it as a starting point for your functionality which is triggered by just adding your bundle in an applications startup sequence.

A Bundle instance is an Oskari class which implements `Oskari.bundle.BundleInstance` protocol. A Bundle instance is created as a result from a Bundle definitions (see above) create method. Bundle instance state and lifecycle is managed by Bundle Manager.

Bundle lifecycle methods

* `start` - called by application to start any functionality that this bundle instance might have
* `update` - called by Bundle Manager when Bundle Manager state is changed (to inform any changes in current 'bundlage')
* `stop` - called by application to stop any functionality this bundle instance has
Bundle instance is injected with a mediator object on startup with provides the bundle with its bundleid:

```javascript
instance.mediator = {
    bundleId : bundleId
}
```

## Definition

The bundle definition (or package) should be located in `bundle.js` file under the `/packages` folder. The bundle package definition should not implement any actual functionality. It should only declare the JavaScript, CSS and localization resources (== files) and metadata if any. If the bundle package can be instantiated the package's `create` method should create the bundle's instance. The bundle doesn't need to have an instance and can be used to import dependency files that can be instantiated elsewhere. In that case the create method should return the bundle class itself (`return this;`).

[Sample bundle definition](/guides/quick-start/sample-bundle-definition)

Bundle should install itself to Oskari framework by calling `installBundleClass` at the end of `bundle.js`

```javascript
Oskari.bundle_manager.installBundleClass("<bundle-identifier>", "Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundle");
```

## Adding new bundle to view

In order to get bundle up and running in your map application, the bundle needs to be added to the database. There are two tables where it shoud be added:

- portti_bundle
- portti_view_bundle_seq

`portti_bundle` includes definitions of all available bundles. Definition of the new bundle should be added here to be able to use it in a view. It is recommended to use `flyway-scripts` when making changes to database. Documentation can be found [here](/documentation/backend/upgrading) and [here](/documentation/backend/upgrade_scripts).

Below is an example of an flyway-script (which is actually `SQL`) adding new bundle to `portti_bundle` table.

	--insert to portti_bundle table
	-- Add login bundle to portti_bundle table
	INSERT
	INTO portti_bundle
	(
		name,
		config,
		state,
		startup
	)
	VALUES
	(
		'login',
		'{}',
		'{}',
		'{
	            "instanceProps":{},
	            "title":"login",
	            "bundleinstancename":"login",
	            "fi":"login",
	            "sv":"login",
	            "en":"login",
	            "bundlename":"login",
	            "metadata": {
	                "Import-Bundle": {
	                    "asdi-login": {
	                        "bundlePath":"/Oskari/packages/bundle/"
	                    }
	                },
	                "Require-Bundle-Instance": []
	            }
	    }'
	);

When bundle is added to `portti_bundle` table, it can be added to `portti_view_bundle_seq` table to be used in a view. Below is an example of an flyway-script adding new bundle to `portti_view_bundle_seq` table.

	-- Add login bundle to default view
	INSERT
	INTO portti_view_bundle_seq
	(
		view_id,
		bundle_id,
		seqno,
		config,
		state,
		startup,
		bundleinstance
	)
	VALUES (
		(SELECT id FROM portti_view WHERE application='servlet' AND type='DEFAULT'),
		(SELECT id FROM portti_bundle WHERE name='login'),
		(SELECT max(seqno)+1 FROM portti_view_bundle_seq WHERE view_id=(SELECT id FROM portti_view WHERE application='servlet' AND type='DEFAULT')),
		(SELECT config FROM portti_bundle WHERE name='login'),
		(SELECT state FROM portti_bundle WHERE name='login'),
		(SELECT startup FROM portti_bundle WHERE name='login'),
		'asdi-login'
	);

After these steps, and when bundle is defined correctly in front-end code, the bundle should be loaded when starting your map application. Great way to check if the bundle is loaded at start is to look at startupSequence in GetAppSetup in developer console. 

## Resources

Any additional CSS definitions or images the bundle needs are located in a similar directory structure under `/resources` folder. Any image links should be relative paths.