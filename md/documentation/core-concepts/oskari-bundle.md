# Oskari bundle

A bundle is a component in an Oskari application. A bundle is a selection of [Oskari classes](documentation/core-concepts/oskari-class) which form a component that offers additional functionality for an application. A bundle can offer multiple implementations for a functionality which can then be divided into smaller packages for different application setups. Packages can be used to offer a multiple views for the same functionality for example search functionality as a small on-map textfield or a window-like UI (see Tile/Flyout) for the same functionality. For a short introduction see [create your own bundle](guides/quick-start/create-your-own-bundle).

## Directory structure

See [here](documentation/directory-structure) for info about structure and conventions.

## Definition

The bundle definition (or package) should be located in `bundle.js` file under the `/packages` folder. The bundle package definition should not implement any actual functionality. It should only declare the JavaScript, CSS and localization resources (== files) and metadata if any. If the bundle package can be instantiated the package's `create` method should create the bundle's instance. The bundle doesn't need to have an instance and can be used to import dependency files that can be instantiated elsewhere. In that case the create method should return the bundle class itself (`return this;`).

[Sample bundle definition](guides/quick-start/sample-bundle-definition)

Bundle should install itself to Oskari framework by calling `installBundleClass` at the end of `bundle.js`

```javascript
Oskari.bundle_manager.installBundleClass("<bundle-identifier>", "Oskari.<mynamespace>.bundle.<bundle-identifier>.MyBundle");
```

## Implementation

Bundles implementation files should be located under the `/bundles` folder. If the bundle has a BundleInstance (ie. something that is started/instantiated when the bundle is played) it is usually defined in a file called `instance.js`, but this is not enforced and any file referenced in bundle definition (`bundle.js`) can be used. The bundle doesn't need to have an instance and can be just used to import dependency files that can be instantiated elsewhere. Usually you want to implement a BundleInstance since you can think of it as a starting point for your functionality which is triggered by just adding your bundle in an applications startup sequence.

A Bundle instance is an Oskari class which implements `Oskari.bundle.BundleInstance` protocol. A Bundle instance is created as a result from a Bundle definitions (see above) create method. Bundle instance state and lifecycle is managed by Bundle Manager.

Bundle lifecycle methods

* `start` - called by application to start any functionality that this bundle instance might have
* `update` - called by Bundle Manager when Bundle Manager state is changed (to inform any changes in current 'bundlage')
* `stop` - called by application to stop any functionality this bundle instance has
Bundle instance is injected with a mediator object on startup with references to bundle manager and class system:

```javascript
bi.mediator = new bundle_mediator( {
    "instanceid" : s,
    "state" : "initial",
    "bundle" : b,
    "instance" : bi,
    "manager" : this,
    "clazz" : clazz.prototype.singleton,
    "requestMediator" : {}
});
```

## Resources

Any additional CSS definitions or images the bundle needs are located in a similar directory structure under `/resources` folder. Any image links should be relative paths.