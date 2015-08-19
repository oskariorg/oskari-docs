## Step 1

Replacing typed address with clickable map

1) Add JS libs

```html
    <!-- jQUery -->
    <script src="lib/jquery-1.11.2.min.js"></script>

    <!-- RPC functionality -->
    <script src="js/rpc/JSChannel/jschannel.js"></script>
    <script src="js/rpc/OskariRPC/OskariRPC.js"></script>

    <!-- Helper for the demo -->
    <script src="js/util.js"></script>
```

2) Add iframe for published map

```html
	<iframe id="publishedMap"
        src="http://54.195.254.125/?lang=en&uuid=8b3bd609-b098-4b7f-8c39-02e201914ddf"
        style="border: none; width: 100%; height: 100%;"></iframe>
```

3) Replace address field with coordinates

OUT: 

```html
      <div class="form-group">
        <label for="coordinates" class="col-sm-2 control-label">Address</label>
        <div class="col-sm-10">
            <input class="form-control" id="coordinates" placeholder="Address near findings">
        </div>
      </div>
```

IN: 
```html
      <div class="form-group">
          <label for="coordinates" class="col-sm-2 control-label">Coordinates</label>
          <div class="col-sm-10">
              <input readonly class="form-control" id="coordinates" name="coordinates"
                     placeholder="Click the map to give coordinates">
          </div>
      </div>
```

4) Open a message bus to the iframe

```javascript
	// constants
    var IFRAME_DOMAIN = 'http://54.195.254.125';

    // Referenced HTML-elements
    var elements = {
        iframe: $("#publishedMap")[0],
        coordinateField: $("#coordinates")[0]
    };

    // init connection
    var channel = OskariRPC.connect(
        elements.iframe,
        IFRAME_DOMAIN
    );
```

5) Listen to map clicks and helper function for setting the coordinate field value

```javascript
    /**
     * Sets the value of coordinates field
     * @param {Double} x lon
     * @param {Double} y lat
     */
    function setCoordinates(x, y) {
        elements.coordinateField.value = x + ', ' + y;
    }

    channel.handleEvent('MapClickedEvent',
        function(data) {
            setCoordinates(data.lon, data.lat);
        }
    );
```

6) Create a helper function to add a marker

```javascript
    function addMarker(marker, id) {
        // get missing id from marker if available
        if(!id) {
        	id = marker.id;
    	}
        channel.postRequest(
            'MapModulePlugin.AddMarkerRequest', [marker, id]
        )
    }
```

7) Modify the map click listener to add a marker on the clicked spot

```javascript
	// constants
    var USER_MARKER_ID = 'REPORT_MARKER';

    channel.handleEvent('MapClickedEvent',
        function(data) {
            setCoordinates(data.lon, data.lat);
            // add a marker to clicked spot
            var marker = Util.getMarkerTemplate();
            marker.x = data.lon;
            marker.y = data.lat;
            addMarker(marker, USER_MARKER_ID);
        }
    );
```


## Step 2

Adding issue type selection and changing maplayers based on issue type

1) Add issue type selection

```html
    <h4>Report environmental issue</h4>
    <form class="form-horizontal">
      <div class="form-group">
        <label for="inputName" class="col-sm-3 control-label">Type of issue:</label>
        <div class="col-sm-9">
            <div class="radio">
                <label>
                    <input type="radio" name="issueType" id="issueType1" value="road" checked>
                    Bad road condition
                </label>
            </div>
            <div class="radio">
                <label>
                    <input type="radio" name="issueType" id="issueType2" value="env">
                    Environmental contaminant
                </label>
            </div>
        </div>
      </div>
```

2) Check the layers that are on the published map - results will be logged to developer console

```javascript
    channel.getAllLayers(
        function (data) {
            Util.log('Layers:', data);
        }
    );
```

This will reveal the layers that are available

	id: 2 - name: "ELF Topographic Basemap"
	id: 42 - name: "ELF Basemap Pilot"
	id: 45 - name: "Ortoimagen - ign.es"
	id: 12 - name: "TN Transport Networks - ign.es"
	id: 38 - name: "HY-P Watercouse - geonorge.no"

3) Add constants for layersets

```javascript
	// constants
    var LAYERS_ENV = [42, 38];
    var LAYERS_ROAD = [45, 12];
```

4) Create a helper function to switch layer sets on/off

```javascript
    /**
     * Takes an list of layer ids and shows/hides them
     * @param  {String[]} layers     list of layer ids
     * @param  {Boolean}  blnVisible true to show, false to hide
     */
    function showLayers(layers, blnVisible) {
        $.each(layers, function(index, layerId) {
            channel.postRequest(
                    'MapModulePlugin.MapLayerVisibilityRequest',
                    [layerId, blnVisible]
            );
        });
    }
```

5) Create a helper function to determine currently selected issue type (exists in util.js)

```javascript
    /**
     * Determines currently selected issue type
     * @return {String} 'road' or 'env'
     */
    Util.getIssueType = function() {
        return $("input:radio[name=issueType]:checked").val();
    };
```

6) Create a helper function to switch between layer sets based on issueType

```javascript
    /**
     * Switch between layer sets based on the issue type selection
     */
    function switchLayersByIssueType() {
        var mode = Util.getIssueType();
        if(mode === 'road') {
            showLayers(LAYERS_ROAD, true);
            showLayers(LAYERS_ENV, false);
        }
        else {
            showLayers(LAYERS_ENV, true);
            showLayers(LAYERS_ROAD, false);
        }
    }
```

7) Add references to issue type selection

```javascript
    // Referenced HTML-elements
    var elements = {
        iframe: $("#publishedMap")[0],
        coordinateField: $("#coordinates")[0],

        issueRoad: $("#issueType1"),
        issueEnv: $("#issueType2")
    };
```

8) Add issue type selections to trigger layer switch change

```javascript
    elements.issueEnv.click(function () {
        switchLayersByIssueType();
    });

    elements.issueRoad.click(function () {
        switchLayersByIssueType();
    });
```

9) Modify layer listing to trigger layerset switch

```javascript
    channel.getAllLayers(
        function (data) {
            Util.log(data);
            switchLayersByIssueType();
        }
    );
```

10) Define marker colors based on type (exists in util.js)

```javascript
    Util.getColor = function(type) {
        if (!type) {
            type = Util.getIssueType();
        }
        if (type === 'road') {
            return "00FFFF";
        }
        return "00FF00";
    };
```

## Step 3

Marker interaction

    // Barcelona: 243132.72059955, 5069415.3984687
    // Norway: 1133693.3710546, 8190191.1661757

1) Html changes

Wrap report form so it can be hidden, add a cancel button and a marker listing placeholder.

```html
    <div id="mode1Form" class="hidden">
    	... form ...
        <button id="btnAddCancel" class="btn btn-default">Cancel</button>
    </div>

    <!-- Listing -->
    <div id="mode2Form">
        <p class="h5">Click marker to get information or</p>
        <button id="btnReportNew" class="btn btn-primary">Report new issue</button>
        <ul class="list-group markers"></ul>
    </div>
```

2) Add references to new elements 

```javascript
    // Referenced HTML-elements
    var elements = {
        iframe: $("#publishedMap")[0],
        coordinateField: $("#coordinates")[0],

        issueRoad: $("#issueType1"),
        issueEnv: $("#issueType2"),

        reportForm: $("#mode1Form"),
        commentForm: $("#mode2Form"),
        addBtn : $("#btnAddNew"),
        cancelBtn :$("#btnAddCancel"),
        reportBtn : $("#btnReportNew"),
        markerList : $("#mode2Form").find('ul.markers')
    };
```

3) Restrict the marker adding to report form

```javascript
    channel.handleEvent('MapClickedEvent',
        function(data) {
            if (!elements.reportForm.is(':visible')) {
                return;
            }
            ...
```

4) Add a helper function to toggle between report form and marker listing

```javascript
    /**
     * Switch between listing and reporting views
     * @param  {Boolean} blnShow true to show form, false for listing
     */
    function showReport(blnShow) {
        if(blnShow) {
            elements.commentForm.addClass('hidden');
            elements.reportForm.removeClass('hidden');
        }
        else {
            elements.commentForm.removeClass('hidden');
            elements.reportForm.addClass('hidden');
        }
    }
```


5) Bind report form toggle to report button and clear previous form values

```javascript
    elements.reportBtn.click(function() {
        Util.resetForm();
        showReport(true);
        return false;
    });
```

6) Add helper for removing a marker

```javascript
    /**
     * Removes marker with given id or clears all markers if undefined
     * @param  {String} id optional marker id
     */
    function removeMarker(id) {
        channel.postRequest(
                'MapModulePlugin.RemoveMarkersRequest', [id]);
    }
```

7) Bind report cancel to remove any marker user added and show marker listing

```javascript
    elements.cancelBtn.click(function() {
        removeMarker(USER_MARKER_ID);
        showReport(false);
        return false;
    });
```

8) Link helper libs to handle saving data

```html
    <script src="js/lodash-3.8.0.js"></script>
    <script src="js/storage.js"></script>
```

9) Add handler for save-button

```javascript
    elements.addBtn.click(function() {
        var values = Util.getFormValues();
        if(!values.coordinates) {
            alert('Mark the spot by clicking on map');
            return false;
        }
        values.id = 'Marker' + new Date().getTime();
        Storage.save(values);
        showReport(false);
        removeMarker(USER_MARKER_ID);
        var marker = Storage.getMarkerDef(values);
        addMarker(marker, marker.id);
        listMarkers();

        return false;
    });
```

10) Populating the marker listing

```javascript
    // constants
    var MARKER_TEMPLATE = _.template(
    	'<li class="list-group-item marker_${id}">' +
            '<h5>${name}</h5>' +
            '<div class="desc">${desc}</div>' +
        '</li>');

    /**
     * Renders given markers to listing placeholder
     * @param  {Object[]} markers list of layers
     */
    function listMarkers(markers) {
        if(!markers) {
            markers = Storage.getMarkers(Util.getIssueType());
        }
        // clear list and map
        elements.markerList.empty();
        removeMarker();

        // add markers
        _.each(markers, function(marker) {
            var dom = jQuery(MARKER_TEMPLATE(marker));
            elements.markerList.append(dom);
            addMarker(Storage.getMarkerDef(marker));
        });
    }
```



11) Setup markers when switching issue types (edit existing click-listeners)

```javascript
    elements.issueEnv.click(function () {
        switchLayersByIssueType();
        if (!elements.reportForm.is(':visible')) {
            var markers = Storage.getMarkers(Util.getIssueType());
            listMarkers(markers);
        }
    });

    elements.issueRoad.click(function () {
        switchLayersByIssueType();
        if (!elements.reportForm.is(':visible')) {
            var markers = Storage.getMarkers(Util.getIssueType());
            listMarkers(markers);
        }
    });
```


12) Setup markers based when page is loaded

```javascript
    channel.getAllLayers(
        function (data) {
            Util.log(data);
            switchLayersByIssueType();
            var markers = Storage.getMarkers(Util.getIssueType());
            var hasMarkers = markers.length > 0;
            showReport(!hasMarkers);
            if(hasMarkers) {
                listMarkers(markers);
            }
        }
    );
```
13) Create a helper function to handle marker click

Implements marker highlighting

```javascript
    /**
     * Highlights the selected marker
     * @param  {String} markerId id of marker to highlight
     */
    function markerClicked(markerId) {
        Util.log('Marker clicked', markerId);
        if(markerId !== USER_MARKER_ID) {
            prevClickedMarker = markerId;
        }
        var marker = Storage.getMarkerValuesById(markerId);
        var def = Storage.getMarkerDef(marker);
        def.size = 5;
        def.shape = 6;
        addMarker(def);
        elements.markerList.find('li.marker_' + markerId).addClass('selected');
    }
```

```html
    <style>
    ul.markers li div.desc {
        display : none;
    }
    ul.markers li.selected h5 {
        text-decoration : underline;
    }
    ul.markers li.selected div.desc {
        display : block;
    }
    </style>
```

13) Handling marker interaction

In marker list/marker: 
```javascript
    dom.click(function() {
        markerClicked(marker.id);
    });
```

From map:
```javascript
    channel.handleEvent('MarkerClickEvent', function (data) {
        if (elements.reportForm.is(':visible')) {
            return;
        }
        markerClicked(data.id);
    });
```

14) Create a helper function for resetting previous highlighted marker

```javascript
    var prevClickedMarker = null;
    /**
     * Removes marker highlight from list and map
     */
    function resetHighlightedMarker() {

        if(prevClickedMarker) {
            var prevMarker = Storage.getMarkerValuesById(prevClickedMarker);
            var prevDef = Storage.getMarkerDef(prevMarker);
            prevDef.size = 4;
            prevDef.shape = 2;
            addMarker(prevDef);
        }
        prevClickedMarker = null;
        elements.markerList.find('li').removeClass('selected');
    }
```

16) Reset previously highlighted marker 

When:
* issuetype switched
* reporting form shown
* marker clicked

```javascript
    function switchLayersByIssueType() {
        resetHighlightedMarker();
        ...
    }
```

```javascript
    function showReport(blnShow) {
        if(blnShow) {
            resetHighlightedMarker();
        ...
    }
```

```javascript
    function markerClicked(markerId) {
        resetHighlightedMarker();
        ...
    }
```
(optional) Listening map marker added

```javascript
    channel.handleEvent('AfterAddMarkerEvent', function (data) {
        Util.log('Marker added', data.id);
    });
```
