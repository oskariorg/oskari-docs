# Oskari 2

## Goal

To make the Oskari frontend code more developer friendly.

Means:

- clarify roles of Oskari concepts:
	- core
	- sandbox
	- bundle
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

## Oskari core
- Still registered as global(?)
- Shared between all codes on the page

Provides/implements:
- lifecycle management for bundles
	- better error handling with lifecycle events like bundle.load.start, bundle.load.end, bundle.load.err, bundle.start, bundle.stop
	- better error handling with app-events (when using appsetups) like  app.start, app.err(, app.warn?)
- Class registry (for backwards compatibility)
	-> Improvements like observable classes
- Eventbus
- Common helper functions for features like logging and localization

## Sandbox

- Named instances available via Oskari.getSandbox({optional name})

Provides:
- communication context for events/requests
- bundle instance registry
   - Registration based on types -> No need to explicitly register as stateful when providing "stateful" as type
- service registry

## Bundle
- functionality identified by bundle id!
	- can have multiple implementations for different UIs, but all share the API
		- This requires modifications for database table portti_bundle
- API documentation problematic: 
	- need API "profiles" so new functionalities don't need to be implemented on each version (ol2/ol3 etc)
	- or another way to describe API discrepancies
- described with a JSON file (similar to bundle.js under Oskari/packages)
    - sensible place for API documentation -> generated bundle documentation
    - bundle files don't need to be in the same folder structure, but should be there whenever possible (files linked in JSON file)
    - how to communicate dependencies (other bundles/libs/code-packages)?
- can have multiple files: js, css, resources
- different types like functional, ui with flyout, plugin, stateful
- separation of functionality and UI into different bundles
  - helps RPC development
  - helps creating custom UIs -> UIs should be built using requests/events (and observable classes)
  - helps testing
- The implementation of a bundle such as function names etc CAN change between releases
  - This shouldn't be a problem since the API is requests/events/service-functions
  - Some common functions like ones provided by the mapmodule SHOULD NOT change, but NEED to be well documented if changed

Provides:
- common API for functionality:
 - events (needs to be presentable as JSON ie. no functions)
 - requests (needs to be presentable as JSON ie. no functions)
 - state/conf (needs to be presentable as JSON ie. no functions)
 - shared service class (for example maplayer-service) (not accessible via RPC, can have functions)

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

### Effects on oskari-server 

#### portti_bundle database table
- config is obsolete since:
  - default config should be included in the core
  - view specific configs are in portti_view_bundle_seq db table
- startup is obsolete since:
	- there can be more than one version -> different implementations of the bundle
	- mark some as default or can we make assumptions of the default? 

**Note! Oskari instance specific default configs could be stored here**
	
# Changes that are needed for frontend clarification

## Oskari "core" separation/clarification

- current core is Oskari/bundles/bundle.js + mapfull bundle
- core init to be automatic -> not in mapfull bundle
- most of the requests/events/map related stuff should be moved from core to mapmodule
- clarify the core functions and provide an layer of code mapping Oskari1 <> Oskari2 functions (backwards compatibility layer)

Thoughts:
- should we give feedback about request delivery (promise/boolean about delivery?/error handling?)
	-> backwards compatibility issue
- at least unify the request sending process (getRequestBuilder/postRequestByName)

- Mapmodule plugins
	- Some of the plugins should be part of mapmodule (layersplugin is required for basic stuff)
	- Some of the plugins could be bundles -> plugins register self to map automatically
-> Both of these removes the need to configure the map needlessly (loading the code is enough, now we need to configure the plugins as well)

## Required functionality:
- registry
	- required by Oskari.clazz.define/create() 
	- wish list to be notified of a new class of type x (for example event/request)
		- observable registry? "class.added", "type.added"
- class-definitions
	- required by Oskari.clazz.define/create()
	- inheritance
	- types -> like current protocol implementation "find all classes of type Request, Event, Tool etc"
	- builder-pattern to construct classes
- eventing
	- classes could be "Observable" -> inherit on/off/trigger/emit etc functions

Small example of how this could work: https://github.com/ZakarFin/modularjs

Bubbling under:
- Common mediator-component for action route calls
	- centralized ajax(/websocket)?
	- easier handling of session expiration/common error handling

### Out of scope:

- Divmanazer API refactoring
	- currently quite complex: bundle -> request -> divmanazer calls bundles getPlugins() -> bundle creates, but divmanazer is somewhere in the middle

--------------
## Current "core-functions"/these will propably change somewhat:

### Oskari:

- getSandbox
- getLang
- registerLocalization
- getLocalization
- getDecimalSeparator
- getSupportedLanguages
- getSupportedLocales(?)
- setDebugMode(?)
- setPreloaded() <- "minified"/dev-mode flag

### Oskari.app:

- getBundleInstanceByName
- getBundleInstanceConfigurationByName
- setBundlePath
- playBundle
- setApplicationSetup
- getApplicationSetup
- setConfiguration
- getConfiguration
- startApplication
- stopApplication

### Oskari.util:
- isNumber
- isDecimal
- decimals
- hexToRgb
- rgbToHex
- keyExists

### Sandbox:

- debugRequests
- debugEvents
- requestEventLog
- requestEventStack
- gatherDebugRequests
- maxGatheredRequestsAndEvents
- requestAndEventGather
- disableDebug
- enableDebug
- printDebug
- printError
- printWarn
- setUser
- getUser
- setAjaxUrl
- getAjaxUrl
- registerService
- getService
- registerAsStateful
- unregisterStateful
- getStatefulComponents
- register
- unregister
- registerForEventByName
- unregisterFromEventByName
- getRequestBuilder
- getEventBuilder
- request
- requestByName
- postMasterComponent
- postRequestByName
- notifyAll
- findRegisteredModuleInstance
- getRequestParameter
- getBrowserWindowSize
- getObjectName
- getObjectCreator
- setObjectCreator
- copyObjectCreatorToFrom
- addRequestHandler
- removeRequestHandler
- popUpSeqDiagram
- getLocalizedProperty
- createURL
- isCtrlKeyDown
- getCurrentState
- resetState
- useState
- setSessionExpiring
- extendSession
- findMapLayerFromAllAvailable
- findAllSelectedMapLayers
- findMapLayerFromSelectedMapLayers
- isLayerAlreadySelected
- findAllHighlightedLayers
- isMapLayerHighLighted
- allowMultipleHighlightLayers
- removeMapLayer
- getMap
- syncMapState
- generateMapLinkParameters
- domSelector
- ajax
- getDefer