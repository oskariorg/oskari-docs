
# Identified code rearrangements

## Core

Has functionality that should be part of the mapmodule bundle

## Sandbox

Has functionality that should be part of the mapmodule bundle

## Mapfull bundle

Has functionality that should be part of the Core

## Mapmodule

- Some of the plugins should be part of mapmodule (layersplugin is required for basic stuff)
- Some of the plugins could be bundles -> plugins register self to map automatically when loaded

Both of these removes the need to configure the map needlessly (loading the code is enough, now we need to configure the plugins as well)

## Most of the bundles

Have functionality tightly tied to UI. Atleast some should be separated to 'service-providing bundles' and UI-bundles.
How to arrange the files? 
- Oskari/bundles/service/search as search-service bundle
- Oskari/bundles/oskari/search-ui as the default ui?
- Load both bundles to get the default search functionality?
 	- this should be defined as bundle dependency in the bundle.json file so we only need to define search-ui as the bundle to start?