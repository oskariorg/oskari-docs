# Bundle loader

In these examples 'oskari/dist/oskari.min.js' is the fictional Oskari2 "core" that's linked to the page. 

```
<script src="oskari/dist/oskari.min.js"></script>
```

All of the examples below would be valid ways to start a bundle/application.

## Starting a bundle manually

Minified bundle linked with script. 

```
<script src="oskari/dist/mapping.mapmodule.min.js"></script>
```
Start the mapmodule bundle with given config/state.
```
Oskari.startBundle('mapmodule', {
	state : {
		east: 25.876,
		north: 60.9085,
		zoom: 8,
		selectedLayers : [{ id: 1}]
	},
	conf : {
		layers : [{
			id : 1,
			url : "http://irs.gis-lab.info/",
			layerName: "landsat"
		}]
	}
})
Oskari.getSandbox().on('AfterMapMoveEvent', function(evt) {
	console.log('Map moved and "fotm.js" needs to know about this!', evt);
});
```

## Start application by giving JSON AppSetup

Manually give the AppSetup.json and starts the app.
Mapmodule loaded using defaults, infobox is loaded from custom location.

```
Oskari.startApp({ 
	"bundles" : [
		"mapmodule", 
		{ 
			"id" : "infobox", 
			"location" : ["/myimpl/infobox"]
		}
	]
});
```

## Start application by giving AppSetup URL

Loads the AppSetup.json from given url, loading the bundles and starts the app.

```
Oskari.startApp('http://oskari.org/?action_route=GetAppSetup');
```

## Start application by giving AppSetup URL and minified application code.

Minified application linked with script. The loader recognizes all code has been loaded and doesn't try to load anything (or maybe tries to load any missing parts?).

```
<script src="oskari/dist/myapp.min.js"></script>
```
Load the AppSetup.json from given url and starts the app.

```
Oskari.startApp('http://oskari.org/?action_route=GetAppSetup');
```