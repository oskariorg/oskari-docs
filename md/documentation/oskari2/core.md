# Core

- Still registered as global(?): window.Oskari = core-functionality
- Shared between all codes on the page

# Provides/implements:

## lifecycle management for bundles

- Different ways of starting an application/functionality
	- [Examples](bundleloader).
- Enable better error handling with lifecycle events like
	- bundle.load.start, bundle.load.end, bundle.load.err, bundle.start, bundle.stop
	- app-events (when using appsetups) like app.start, app.err(, app.warn?)

```
Oskari.on('bundle.load.err', function(details) {
	console.log('Error loading bundle!!', details);
});
Oskari.on('bundle.start', function(details) {
	console.log('Bundle started!!', details);
});
Oskari.on('app.start', function(details) {
	console.log('App started', details);
}):

Oskari.startApp('http://oskari.org/?action_route=GetAppSetup');
```
## Bundle instance registry
- Registration based on declared types
	- No need to explicitly register as stateful when providing "stateful" as type
- Moved from sandbox to core

##  Class registry
- needed for backwards compatibility
- something like [this](https://github.com/ZakarFin/modularjs/blob/master/tests/class-definition.js)
	- easy to map current classes with compatibility layer
- Improvements like observable classes
	- lightweight eventing inside bundle to separate UI from functionality

## Eventbus
- core functionality to subscribe to/publish events on given context (class/sandbox)
- Used internally and with bundle-specific API events.

## Common helper functions for features like logging and localization

Classes could inherited logging functions. Helpful when debugging minified code.

```
this.log.debug('My debug message');
// -> Oskari.mapmodule.js: My debug message
Oskari.log.error('Tried to send request that is not loaded!');
// -> !!! Oskari: Tried to send request that is not loaded!
```

## Problems with the current core

- all over the place
	- current core is Oskari/bundles/bundle.js + mapfull bundle and then some
- core init to be automatic while creating Oskari-global -> not in mapfull bundle
- most of the requests/events/map related stuff should be moved from core to mapmodule
	- provide an layer of code mapping Oskari1 <> Oskari2 functions (backwards compatibility layer)


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