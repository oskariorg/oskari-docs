# Sandbox

Named instances available via Oskari.getSandbox("{optional name}"). An application can use multiple sandboxes as contexts where for example two maps need to be controlled without sharing the state.

## Provides:
- communication context for events/requests
- requesthandler functionality (one handler per request per sandbox)
	- moved out of core to enable requesthandlers/sandbox
- service registry

Thoughts:
- should we give feedback about request delivery (promise/boolean about delivery?/error handling?)
	-> backwards compatibility issue
- at least unify the request sending process (getRequestBuilder/postRequestByName)

Via sandbox
```
var sb = Oskari.getSandbox();
var numberOfListeners = sb.trigger('AfterMapMoveEvent', event);

var blnReceived = sb.request('MapMoveRequest', [...]);

var otherSB = Oskari.getSandbox('OtherSB');
var blnOtherMapReceived = otherSB.request('MapMoveRequest', [...]);
```

Via bundle instance? This could fill in which bundle triggered the event and enable creation of sequence diagrams
```
this.trigger('AfterMapMoveEvent', event);
var blnReceived = this.request('MapMoveRequest', [...]);
```


## Current "core-functions"/these will propably change somewhat:

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