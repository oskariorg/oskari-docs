# Oskari-frontend directory structure

## Directory Structure

```
<your root dir/oskari-frontend>
|--bundles
|  |--<mynamespace>
|     |--<bundle-identifier>
|           |--instance.js
|           |--resources
|           |  |--css
|           |  |  |--style.css
|           |  |--images
|           |  |  |--image.png
|           |  |--locales
|           |      |--en.js
|           |      |--fi.js
|           |      |--sv.js
|           |--scss
|              |--style.scss
|--packages
|  |--<mynamespace>
|      |--<bundle-identifier>
|         |--bundle.js
```

These are the conventions used to structure code inside oskari-frontend repository:

### Bundle files

A bundle in Oskari means a piece of code that provides additional functionality to an app. It can interact with other parts of the app but it should either document any dependencies to other bundles or handle a scenario where there might not be all or any of the expected other bundles that are used/expected to be part of the app for the bundle to work properly. Bundles are used as feature toggles to include more functionality to an Oskari-based app but the point is that they are not always available on all appsetups. Bundles have internal lifecycle methods that Oskari uses when the application dictates the bundle should be started as part of the app. Bundles can also offer an API for other bundles to use and interact with it's functionalities and can use API offered by other bundles to create an integrated experience for the end-user.

* Definition/factory file: Create `bundle.js` file under `packages/<mynamespace>/<bundle-identifier>/` folder structure. This is used to create instances of the bundle. Multiple instances of a bundle can run parallel with different configurations (requires support for parallel usage from the bundle)
* Implementation files: Create `instance.js` file under the `bundles/<mynamespace>/<bundle-identifier>` folder structure. This is the main entrypoint for the bundle instance and needs to be referenced in the bundle.js file
* Functionality specific resources (localization, css, images): Create `resources` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Check all stylesheet files under the `bundles/<mynamespace>/<bundle-identifier>/resources/css` folder at the images paths are correct (`../images`)
* When using SCSS: create `scss` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder.
* Add `[lang].js` files under the `bundles/<mynamespace>/<bundle-identifier>/resources/locale` folder for localization. These need to be referenced in bundle.js (factory file)
* Check that path references to files under implementation are correct on the `packages/<mynamespace>/<bundle-identifier>/bundle.js` file:

  * JavaScript files: `bundles/<mynamespace>/<bundle-identifier>/..`
  * Locale files: `bundles/<mynamespace>/<bundle-identifier>/resources/locale/..`
  * CSS files: `bundles/<mynamespace>/<bundle-identifier>/resources/css/..`

Any file used in the bundle implementation must be referenced in bundle.js OR imported via instance.js as ES6 modules. Otherwise they don't get packaged on the build. Locale-files need to be declared separately so the build-script can construct language-based files for the application (only the current languages locale is loaded to the browser).
