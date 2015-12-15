# Oskari 2

## Goal

To make the Oskari frontend code more developer friendly:

- Clarify roles of Oskari concepts:
	- [core](core)
	- [sandbox](sandbox)
	- [bundle](bundle)
- Clarify the API offered by each of the components
	- API doc for core/sandbox
	- Bundles
		- What is a bundle? -> Functionality identified by an id
		- What is the API offered by a bundle? -> Requests, events, services
		- How to document it? -> Describe functionality in general, list implementations or it
		- Can it be generated automatically? -> Wishlist: automatic generation of referenced public API
- Provide backwards compatibility with an integration layer that maps previous Oskari implementation to the new API:
	- Most propably there won't be `sandbox.getMap()` in the new API, but something like `sandbox.getService('mapmodule')`. 
	- The compatibility layer will add `getMap()`-function to sandbox, but internally call `sandbox.getService('mapmodule')`.
	- [Identified code rearrangements](coderearrangements)

- More tools for front-end development like:
	- Static file serving node.js server
	- Way of minifying bundles that can be inserted to page with simple &lt;script&gt; tag to get the functionality
	- Customization for builds with application variables (like colorscheme)
- Separating functionality from UI with lightweight events (for future development atleast)
- Providing default resources that can be overridden in apps
- Documented way of extending the Oskari front-end code from external repository


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
	- easier to override the ajax-endpoint calls if necessary

### Out of scope:

- Divmanazer API refactoring
	- currently quite complex: bundle -> request -> divmanazer calls bundles getPlugins() -> bundle creates, but divmanazer is somewhere in the middle
