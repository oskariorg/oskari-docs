# Directory structure for Oskari

* `/applications` - Definitions for application setups combining bundles into a specific application

* `/bundles` - Implementation files for extension bundles

* `/packages` - Definition files for extension bundles

* `/resources` - CSS styles/images for extension bundles

* `/sources` - Oskari core

* `/libraries` - jQuery plugins and other dependencies/libraries

The folder structure follows a pattern where the first folder under the base folder is a namespace folder. Oskari uses framework for the main bundles, but this is optional and you can separate your bundles to own namespace. The next folder in the structure is named `bundle`. This is just a convention and is not a functional requirement. The next folder is named after the `<bundle-identifier>`.

```
<your root dir>
|--bundles
|  |--<mynamespace>
|     |--bundle
|        |--<bundle-identifier>
|           |--instance.js
|--packages
|  |--<mynamespace>
|     |--bundle
|        |--<bundle-identifier>
|           |--bundle.js
|--resources
   |--<mynamespace>
      |--bundle
         |--<bundle-identifier>
            |--css
            |  |--style.css
            |--images
               |--image.png
```

## Bundle implementation convention

Any events, requests (and request handlers) and services a bundle implements should be separated into subfolders under the bundles implementation. In addition if you have divided the code into views or components that are shown on the flyout, you can create subfolders for them as well.

```
<your root dir>
|--bundles
   |--<mynamespace>
      |--bundle
         |--<bundle-identifier>
            |--event
            |  |--MyEvent.js
            |--request
            |  |--MyRequest.js
            |  |--MyRequestHandler.js
            |--service
            |  |--MyService.js
            |--component
            |  |--MyComponent.js
            |--view
            |  |--MyLoggedInView.js
            |  |--MyGuestView.js
            |--instance.js
            |--Tile.js
            |--Flyout.js
```