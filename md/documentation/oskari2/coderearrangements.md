
# Identified code rearrangements

## Core

Has functionality that should be part of the mapmodule bundle

## Sandbox

Has functionality that should be part of the mapmodule bundle

## Mapfull bundle

Is a special snowflake bundle since it has functionality that should be part of the Core.
Has no real use once core functionalities are removed -> mapmodule should replace mapfull.

## Mapmodule

- Some of the plugins should be part of mapmodule (layersplugin is required for pretty basic stuff)
- Some of the plugins could be bundles that are started independently
	- instead being part of mapfull bundles imports
	- plugins to init/register self to map automatically when loaded

Both of these removes the need to configure the map needlessly (loading the code is enough, now we need to configure the plugins as well)

## Most of the bundles

Functionality tightly coupled to UI. Atleast some bundles should be separated to 'service-providing bundles' and UI-bundles.
How to arrange the files? 
- Oskari/bundles/service/search as search-service bundle
- Oskari/bundles/oskari/search-ui as the default ui?
- Load both bundles to get the default search functionality?
 	- this should be defined as bundle dependency in the bundle.json file so we only need to define search-ui as the bundle to start?