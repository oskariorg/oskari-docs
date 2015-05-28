#Inspire workshop

This guide is originally made for Inspire conference workshop. The aim is to demonstrate the use of embedded map and RPC together to create interactive map services.

The case is that an organization has an existing [website](/examples/rpc-control/) including functionality for [reporting road condition issues](/examples/rpc-control/mapservice_base.html). The location information is address based, but we want to use a map instead. We will first build a [simple](/examples/rpc-control/mapservice_step1.html) map interface, then adjust it to enable reporting of [environmental issues](/examples/rpc-control/mapservice_step2.html) as well and last add some [social features](/examples/rpc-control/mapservice_step3.html). This is done by controlling the map from the embedding page.

The source code for this demo can be found in [GitHub](https://github.com/nls-oskari/oskari.org/tree/master/public/examples/rpc-control).

## Getting started

To be able to use RPC you need to be able to run the html-document on a server. To get the basic knowledge of RPC see the following documentation: [http://www.oskari.org/documentation/bundles/framework/rpc](http://www.oskari.org/documentation/bundles/framework/rpc)

In this example we have a case where citizens can report environmental issues on the web. For this case we have built a simple web page which looks like this [oskari.org/examples/rpc-control/mapservice_base.html](/examples/rpc-control/mapservice_base.html). It is not a real web page but one made for for demonstrative purposes. At this point the web page is quite impractical because the user needs to know the address where the bad road condition occurs. At this example we add map service functionalities and interactivity to the web page to make it more useful for reporting environmental issues.

## Step 1: Replacing typed address with clickable map

In the first phase we embed a map to our website so that user can click the map to specify the location where the bad road condition occurs. The result will look like this: [oskari.org/examples/rpc-control/mapservice_step1.html](/examples/rpc-control/mapservice_step1.html)

1) Add map to the page

```html
	<iframe id="publishedMap"
        src="http://54.75.147.57/?lang=en&uuid=8b3bd609-b098-4b7f-8c39-02e201914ddf"
        style="border: none; width: 100%; height: 100%;"></iframe>
```

2) Replace address field with coordinates

OUT: 

```html
      <div class="form-group">
        <label for="coordinates" class="col-sm-4 control-label">Address</label>
        <div class="col-sm-8">
            <input class="form-control" id="address" placeholder="Address near findings">
        </div>
      </div>
```

IN: 
```html
    <div class="form-group">
        <label for="coordinates" class="col-sm-4 control-label">Coordinates</label>

        <div class="col-sm-8">
            <input readonly class="form-control" id="coordinates" name="coordinates"
                   placeholder="Click the map to give coordinates">
        </div>
    </div>
```

3) Link the required JavaScript libraries

```html
    <!-- jQUery -->
    <script src="lib/jquery-1.11.2.min.js"></script>

    <!-- RPC functionality -->
    <script src="js/rpc/JSChannel/jschannel.js"></script>
    <script src="js/rpc/OskariRPC/OskariRPC.js"></script>

    <!-- Helper for the demo -->
    <script src="js/util.js"></script>
```


### Now we can start adding some JavaScript to create the functionalities. The JavaScripts below need to be inserted between script tags.

```html
<script>
</script>
```

4) Open a message bus to the iframe

```javascript
	// constants
    var IFRAME_DOMAIN = 'http://54.75.147.57';

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

5) Listen to map clicks and a helper function for setting the coordinate field value

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
At this point we can refresh our website and check if everything went correctly and the map click gives us coordinates.

Next we want to visualize the clicked location by adding a marker.

6) Create a helper function to add a marker

```javascript
    function addMarker(marker, id) {
        // get missing id from marker data
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
The first phase is now ready and we should have a web site with an embedded map and simple RPC functionality.

## Step 2: Adding issue type selection and changing maplayers based on issue type

In the second phase we enable reporting not only bad road condition but also environmental contaminant. The result will look like this: [oskari.org/examples/rpc-control/mapservice_step2.html](/examples/rpc-control/mapservice_step2.html)

1) Add issue type selection.

*The code below is added to the container*

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

*The code below is now JavaScript*

```javascript
    channel.getAllLayers(
        function (data) {
            //alert(JSON.stringify(data));
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
    id: userlayer_7 - name: "Gas stations"

3) Add constants for layersets. These are used further to tell which layers should be shown in each case.

```javascript
	// constants
    var LAYERS_ENV = [42, 38, "userlayer_7"];
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

11) Create a helper function to move map to specific location


```javascript
    /**
     * Moves map center to given coordinates
     * @param  {Number} x         lon
     * @param  {Number} y         lat
     * @param  {Number} zoomLevel optional zoom level
     */
    function moveMap(x, y, zoomLevel) {
        channel.postRequest(
            'MapMoveRequest', [x, y,zoomLevel]
        );
    };
```

12) Trigger a location change when reporting issue types

```javascript
    // constants
    var LOCATION_BARCELONA = [243132.72059955, 5069415.3984687];
    var LOCATION_OSLO = [1198332.8217465, 8387919.4263792];

    elements.issueEnv.click(function () {
        switchLayersByIssueType();
        moveMap(LOCATION_OSLO[0], LOCATION_OSLO[1]);
    });

    elements.issueRoad.click(function () {
        switchLayersByIssueType();
        moveMap(LOCATION_BARCELONA[0], LOCATION_BARCELONA[1]);
    });
```


Now we are finished with the second phase functionalities. On our web page we can now choose which issue to report and the map layers as well as the marker color change according to the issue type.

## Step 3: Marker interaction

Let's make this web service interactive by giving users chance to click added markers and see their information. This phase is the last in this example.

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

*Implements marker highlighting*

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

14) Handling marker interaction

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

15) Create a helper function for resetting previous highlighted marker

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

##The example web page is now ready!