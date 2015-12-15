# Bundle
Functionality identified by id! 

Can have multiple implementations for different UIs, but all share the API:
- mapmodule is always mapmodule that:
	- provides map functionality
	- map location can be changed by MapMoveRequest
		- which will trigger AfterMapMoveEvent
	- can be implemented with ol3/ol2/leaflet/cesium.
- infobox is always infobox that:
	- provides way to show information on map
	- info can be added by ShowInfoboxRequest
	- implementation can for example: 
		- open an Openlayers popup on map to show the info
		- add a marker/highlight a feature on map and show the info on panel beside the map.

Provides:
- (~single) functionality or UI for functionality
- common API for functionality:
	- events (needs to be presentable as JSON ie. no functions)
	- requests (needs to be presentable as JSON ie. no functions)
	- state/conf (needs to be presentable as JSON ie. no functions)
	- shared service class (for example maplayer-service) (not accessible via RPC, can have functions)

## Described with a JSON file (similar to bundle.js under Oskari/packages)
- sensible place for API documentation -> generated bundle documentation
- bundle files don't need to be in the same folder structure, but should be there whenever possible (files linked in JSON file)
- how to communicate dependencies (other bundles/libs/code-packages)?
- can have multiple files: js, css, resources
- can have dependency on another bundle
	- minified together when building single bundle files(?) or provide both bundle.min.js and bundle-with-deps.min.js(?)
	- start/load dependencies before loading requested bundle(?) 

## API documentation problematic: 
- need API "profiles" so new functionalities don't need to be implemented on each version (ol2/ol3 etc)
- or another way to describe API discrepancies
- API tests are needed so:
	- new implementations can be tested for API conformance
	- usable as examples for using the API

## Different types like functional, ui with flyout, plugin, stateful

Separation of functionality and UI into different bundles
- helps RPC development
- helps creating custom UIs -> UIs should be built using requests/events (and observable classes)
- helps testing

- The implementation of a bundle such as function names etc CAN change between releases
  - This shouldn't be a problem since the API is requests/events/service-functions
  - Some common functions like ones provided by the mapmodule SHOULD NOT change, but NEED to be well documented if changed


### Effects on oskari-server 

#### portti_bundle database table
- config is obsolete since:
  - default config should be included in the code
  - view specific configs are in portti_view_bundle_seq db table
- startup is obsolete since:
	- there can be more than one version -> different implementations of the bundle
	- mark some as default or can we make assumptions of the default? 

**Note! Oskari instance specific default configs could be stored here**