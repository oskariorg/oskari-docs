# Oskari 2

## Goal

To make the Oskari frontend code more developer friendly.

Means:

- clarify roles of Oskari concepts:
	- [core](core)
	- [sandbox](sandbox)
	- [bundle](bundle)
- clarify the API offered by each of the components
	- clean and documented API
- provide backwards compatibility with an integration layer that maps previous Oskari implementation to the new API
- more tools for front-end development like:
	- static file serving node.js server
	- way of minifying bundles that can be inserted to page with simple &lt;script&gt; tag to get the functionality
	- customization for builds with application variables (like colorscheme)
- separating functionality from UI (for future development atleast)
- providing default resources that can be overridden in apps
- means to provide bundle functionality from outside the Oskari-folder
- [code rearrangements](coderearrangements)


### Wish list
- tool for generating a skeleton for bundle.json
	- atleast file list in given directory
	- maybe detecting used and provided events and requests
	- detecting implementations of the bundle (for example different implementations of layerselector etc)
- tool for generating a minified bundle
	- usable as "standalone" with  &lt;script&gt; tag on the page
	- resources handling needs some thought (separate file(s)/minified into single file with code/images base64 encoded into css/other options?)
- tool for generating bundle-docs based on bundle.json
	- links to different implementations of the bundle

- Options to implement bundles in different ways es2015/current bundles/require.js/common.js module
  - Requires more thought/suggestions
  - babel.js, webpack, custom minifier (each will require customization/plugin to work with Oskari)

Small example of how this could work: https://github.com/ZakarFin/modularjs

Bubbling under:
- Common mediator-component for action route calls
	- centralized ajax(/websocket)?
	- easier handling of session expiration/common error handling
	- easier to override the ajax endpoints to call if necessary

### Out of scope:

- Divmanazer API refactoring
	- currently quite complex: bundle -> request -> divmanazer calls bundles getPlugins() -> bundle creates, but divmanazer is somewhere in the middle
