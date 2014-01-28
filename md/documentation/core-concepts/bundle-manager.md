# Bundle manager/loader

* loads Bundle Definitions
* manages bundle state and lifecycle
* loads Bundle JavaScript sources and CSS resources
* instantiates Bundle Instances
* manages Bundle Instance lifecycle

## Bundle player

Bundle player is part of Oskari Bundle Manager. Bundle player determines any JavaScript that must be loaded for a bundle and registers the bundle to the system.

Bundle player creates a bundle instance by calling bundle class's `create` method.

Bundle player plays one bundle or a playlist of bundles in sequence as defined in applications startup sequence.

The Bundle Player processes Bundle Player JSON definitions to determine which bundle to launch and where it is available for loading.

### Playing a bundle JSON means

1. loading bundle definition from bundle.js
    * bundle definition file `bundle.js` must only define a bundle class which is more of a container for bundle metadata
    * bundle is a normal JavaScript class that implements the methods required: `create`, `update`
    * bundle definition file bundle.js must have a call to installBundleClass() which registers the bundle to the bundle manager (see Bundle Definition)

2. loading bundle sources from sources
    * bundle sources are declared in bundle definition metadata
    * bundle loader loads any declared JavaScript files by adding script elements to the HTML page

3. creating a bundle instance by calling bundle's create method
    * bundle instance is a normal JavaScript class that implements required member functions or methods
    * any bundle instance must implement the bundle instance protocol with methods start, stop, update (see: Bundle Instance).

4. starting the bundle instance by calling instance's start method
    * a bundle instance MAY register itself (or other class instance) as a user interface extension when started

### Loading Bundle sources means one of the following

* Actually loading JavaScript files defined in `bundle.js`. Enable by calling `setLoaderMode('dev')` method before starting the application:

```javascript
Oskari.setLoaderMode('dev');
```

* Assuming any JavaScript is already loaded as an app-pack/linked on page so loader doesn't try to load them again. Enable by calling `setPreloaded(true)` method before starting the application:

```javascript
Oskari.setPreloaded(true);
```

### Details on Bundle player play list processing

Bundle player processes a list of Bundle JSON. The implementation currently relies on `window.setTimeout` calls to loose some stack frames in-between load phases. This might change in future. Bundle loader has built-in state and notification system that may be used in the future to trigger next phase after the previous has been completed.