#Inspire workshop

This guide is originally made for Inspire conference workshop. The aim is to demonstrate the use of embedded map and RPC together to create interactive map services.

The case is that organization wants to include map on their web page and control it from the parent document. On this guide we will build the functionalities step by step. The end result will look like this: [Insert here link to the final web page]

## Getting started

To be able to use RPC you need to able to run the html-document on a server.

## Step 1: Get coordinates from embedded map

This first step can be done by following the instruction from http://www.oskari.org/guides/rpc-step-by-step. One change is made to the setCoords function:

```javascript
setCoords = function(x, y) {
  coordinateDisplay.value = x + ', ' + y;
}
```

## Step 2: Possibility to change the type of an environmental issue

First we add some layers to our published map to make the map more informative for reporting environmental contaminant.

Now we can start to edit our code. Let's add radiobuttons for different options.

```html
<div class="form-group">
	<label for="inputName" class="col-sm-3 control-label">Type of issue:</label>
	<div class="col-sm-9">
		<div class="radio">
		    <label>
		        <input type="radio" name="issueType" id="issueType1" value="option1" checked>
		        Bad road condition
		    </label>
		</div>
		<div class="radio">
		    <label>
		        <input type="radio" name="issueType" id="issueType2" value="option2">
		        Environmental contaminant
		    </label>
		</div>
	</div>
</div>
```

Visibility of the map layers is changed according to the chosen option.

```javascript
channel.getAllLayers(
    function(data) {
        console.log(data);
        channel.postRequest(
            'MapModulePlugin.MapLayerVisibilityRequest',
            [42, false],
            function(error, message) {
                log('error', error, message);
            }
        );
        channel.postRequest(
            'MapModulePlugin.MapLayerVisibilityRequest',
            [18, false],
            function(error, message) {
                log('error', error, message);
            }
        );
    }
);

document.getElementById('issueType2').onclick = function () {
  channel.postRequest(
      'MapModulePlugin.MapLayerVisibilityRequest',
          [38, true],
      function(error, message) {
          log('error', error, message);
      }
  );
  channel.postRequest(
      'MapModulePlugin.MapLayerVisibilityRequest',
          [42, true],
      function(error, message) {
          log('error', error, message);
      }
  );
  channel.postRequest(
      'MapModulePlugin.MapLayerVisibilityRequest',
          [2, false],
      function(error, message) {
          log('error', error, message);
      }
  );
};

document.getElementById('issueType1').onclick = function () {
  channel.postRequest(
      'MapModulePlugin.MapLayerVisibilityRequest',
          [24, false],
      function(error, message) {
          log('error', error, message);
      }
  );
  channel.postRequest(
      'MapModulePlugin.MapLayerVisibilityRequest',
          [100, false],
      function(error, message) {
          log('error', error, message);
      }
  );
};
```
Markers color can be changed according to the chosen option.

```javascript
channel.handleEvent(
'MapClickedEvent',
	function(data) {
	    if(markerCounter > 0) {
	        channel.postRequest(
	            'MapModulePlugin.RemoveMarkersRequest', [],
	            function(error, message) {
	                log('error', error, message);
	            }
	        );
	        markerCounter = 0;
	    }
	    if (document.getElementById('optionsRadios1').checked === true) {
	        setTimeout(channel.postRequest(
	            'MapModulePlugin.AddMarkerRequest', [{
	                    x: data.lon,
	                    y: data.lat,
	                    color: "ff0000",
	                    size: 2
	                },
	                'RPCMarker' + markerCounter
	            ],
	            function(error, message) {
	                log('error', error, message);
	            }
	        ), 200);
	    } else if (document.getElementById('optionsRadios2').checked === true) {
	        setTimeout(channel.postRequest(
	            'MapModulePlugin.AddMarkerRequest', [{
	                    x: data.lon,
	                    y: data.lat,
	                    color: "666600",
	                    size: 2
	                },
	                'RPCMarker' + markerCounter
	            ],
	            function(error, message) {
	                log('error', error, message);
	            }
	        ), 200);
	    }
	    markerCounter++;
	    setCoords(data.lon, data.lat);
	},
	function(error, message) {
	    log('error', error, message);
	}
);
```

## Step 3: Possibility to click markers and get information

In order to be able to click markers, we need to ignore MapClicked event and listen to MarkerClicked event. This means that we need two modes to get to know if user wants to add marker or click markers.

```html
<div class="form-group">
	<div class="col-sm-9">
	    <div class="radio">
	        <label>
	            <input type="radio" name="mode" id="mode1" value="option1" checked>
	            report issue
	        </label>
	    </div>
	    <div class="radio">
	        <label>
	            <input type="radio" name="mode" id="mode2" value="option2">
	            look and comment reported issues
	        </label>
	    </div>
	</div>
</div>
```
First we need to start listen AfterAddMarkerEvent to save the markers information to local storage for further use.

```
channel.handleEvent('AfterAddMarkerEvent', function(data) {
   log('Marker jee added', data.id);
});
```

Now we can start to listen MarkerClicked event

```javascript
channel.handleEvent('MarkerClickEvent', function(data) {
  if (document.getElementById('mode1').checked === true) {
    return;
  } else {
    log('Marker click', data.id);
  }
});
```


