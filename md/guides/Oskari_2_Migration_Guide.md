# Oskari 2.x Migration Guide

## Directory Structure Changes (2.0)

Oskari 2 folder structure is changed clearer than the version 1.xx.

```
<your root dir>
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
|     |--bundle
|        |--<bundle-identifier>
|           |--bundle.js
```

Due to these changes will make the following changes to the version 1.xx implementations:
* Create `<bundle-identifier>` folder under the `bundles/<mynamespace>` folder
* Move all files and folders in `bundles/<mynamespace>/bundle/<bundle-identifier>` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Delete `bundles/<mynamespace>/bundle/<bundle-identifier>` folder
* Delete also `bundles/<mynamespace>/bundle` folder if it's empty
* Create `resources` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Move all files and folders in `resources/<mynamespace>/bundle/<bundle-identifier>` folder under the `bundles/<mynamespace>/<bundle-identifier>/resources` folder
* Delete `resources/<mynamespace>/bundle/<bundle-identifier>` folder
* Delete also `resources/<mynamespace>/bundle` folder if it's empty
* Check all stylesheet files under the `bundles/<mynamespace>/<bundle-identifier>/resources/css` folder at the images paths are correct (`../images`)
* Create `locale` folder under the `bundles/<mynamespace>/<bundle-identifier>/resources` folder
* Move all files in `bundles/<mynamespace>/<bundle-identifier>/locale` folder under the `bundles/<mynamespace>/<bundle-identifier>/resources/locale` folder
* Delete `resources/<mynamespace>/bundle/<bundle-identifier>/locale` folder
* Create `scss` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Move all files and folders in `bundles/<mynamespace>/bundle/<bundle-identifier>/scss` folder under the `bundles/<mynamespace>/<bundle-identifier>` folder
* Delete `bundles/<mynamespace>/bundle/<bundle-identifier>/scss` folder
* Fix all bundle file locations on the `packages/<mynamespace>/bundle/<bundle-identifier>/bundle.js` file
** JavaScript files: `bundles/<mynamespace>/<bundle-identifier>/..`
** Locale files: `bundles/<mynamespace>/<bundle-identifier>/resources/locale/..`
** CSS files: `bundles/<mynamespace>/<bundle-identifier>/resources/css/..`