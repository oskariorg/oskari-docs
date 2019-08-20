# FOSS4G2019 Oskari workshop

This document guides you through the Oskari workshop describing the steps needed to embed a map to a webpage and control it from the parent page using Oskari RPC functionality. In this workshop we publish a map from the https://demo.oskari.org, embed the published map to a webpage, add locations of attractions in Bucharest to a map and add some functionalities to get information about the attractions. We also cover how to add own points of interests to a map by clicking the location.

## Initial preparations

In this workshop we use CodePen for the development to prevent using time by installing software or setting up a server.

1. Sign up / Log in to CodePen (https://codepen.io)
2. Search 'Oskari RPC demo' (by Sami Mäkinen) pen from the CodePen and click to open it
3. Start using Oskari RPC demo as a template for your workshop by clicking 'Create Pen from This Template' on the lower right corner.

As an example and a starting point, the template already has an embedded map published from the Oskari-based map application. The template also includes the necessary stuff to get RPC up and running.

Let's take a closer look at the template html code:

First we include RPC javascript in html
```html
<script src="https://oskari.org/js/rpc/rpc-client.min.js"></script>
```

Next we embed a published map by copying the iframe code from the Oskari-based map application to html template
```html
<iframe src="https://demo-kartta.paikkatietoikkuna.fi/published/fi/c4ddaa13-ba2a-4593-bb85-5dbaecf7fd6c" allow="geolocation" id="map" style="border: none; width: 100%; height: 100%;"></iframe>
```

That's the html code so far. Then let's take a closer took to the JavaScript.

First we initialize the RPC connection. Note that the IFRAME_DOMAIN must match to the source domain in the iframe.
```html
const IFRAME_DOMAIN = 'https://demo-kartta.paikkatietoikkuna.fi';
const mapEl = document.getElementById('map');
const channel = OskariRPC.connect(mapEl, IFRAME_DOMAIN);
var metadata;
channel.onReady(function() {
    //channel is now ready and listening.
    channel.log('Map is now listening');
    // getInfo can be used to get the current Oskari version
    channel.getInfo(function(oskariInfo) {
       channel.log('Current Oskari-instance reports version as: ', oskariInfo);
       metadata = oskariInfo;
    });
});
```
Then we test the RPC-functionality using MapClickedEvent to cause alert that shows the clicked coordinates and coordinate system.
```html
channel.handleEvent('MapClickedEvent', function(data) {
  alert('Map clicked! At ' + data.lon + ', ' + data.lat + ' (' + metadata.srs + ')');
});
```

Now that we are familiar with the basic setup, let's start building our own map application showing attractions of Bucharest!

## Adding RPC functionality

1. Publish a map
Publish a world-wide map from the https://demo.oskari.org/. 

2. Add map to the CodePen html template
Copy the iframe code and replace the existing one in the CodePen html template with this new one

3. Add attractions to map
- The geojson including five attractions in Bucharest is named as poi.json as can be found ready in project
- Let's use the RPC request *AddFeaturesToMapRequest* to add the attractions to map

```html
HELPER.getFeatures().then(function(geojson) {
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
    layerId: LAYER_ID,
    featureStyle: STYLES.normal
  }]);
}).catch(function (err) {
  alert(err);
});
```
Now we can see the attractions on a map, but it doesn't give us very much information of them. Let's make sidebar for showing the names and other information of attractions.

4. List attraction to side panel
We create the sidebar for listing the attractions on a map. Each attraction will be list in it's own collapsible panel so that the information can be seen by clicking the name of the attraction.

We add that functionality to the same function we used in previous step. After this the function will be as follows:

```html
HELPER.getFeatures().then(function(geojson) {
  let listUI = HELPER.getFeatureUI();
  geojson.features.forEach(feature => {
    const panel = HELPER.createFeaturePanel(feature);
    listUI.append(panel);
  });
  
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
    layerId: LAYER_ID,
    featureStyle: STYLES.normal
  }]);
}).catch(function (err) {
  alert(err);
});
```

Now we need to add some functionality to create the link between the side panel and the map.

5. Create interaction between the map and the side panel

Next we want to highlight features on a map while they are clicked on the sidebar menu. Features styles can be updated by using the same request when adding features (addFeaturesToMapRequest) but giving the feature attributes and the wanted style.

Let's make the functions featureClicked and setFeatureStyle which handle the feature click and highlight the clicked feature.

```html
var selectedFeature = null;
function featureClicked(id, scroll) {
  if(id == selectedFeature) {
    return;
  }
  if (selectedFeature) {
    // reset style on previously selected
    setFeatureStyle(selectedFeature, STYLES.normal);
  }
  selectedFeature = id;
  setFeatureStyle(id, STYLES.selected);
}

function setFeatureStyle(id, style) {
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [{ 'id': id }, {
      featureStyle: style,
      layerId: LAYER_ID 
  }]);
}
```

Now we need to listen panel click and react to them. We add the click listener to the same function used to render the sidebar. After that the function looks as follows:

```html
HELPER.getFeatures().then(function(geojson) {
  let listUI = HELPER.getFeatureUI();
  geojson.features.forEach(feature => {
    const panel = HELPER.createFeaturePanel(feature);
    panel.on('click', () => featureClicked(feature.properties.id, false));
    listUI.append(panel);
  });
  
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
    layerId: LAYER_ID,
    featureStyle: STYLES.normal
  }]);
}).catch(function (err) {
  alert(err);
});
```
Now we know where the attractions are on a map, but what if we want to know which feature on a map is which attraction? We need to listen feature clicks on a map and highlight right attraction on a sidebar.

6. Catch feature clicks and add functionality

When feature is clicked the *featureEvent* is sent with the parameter "operation: click". The event includes the clicked feature. Let's listen to featureEvent and hightlight the name of the clicked feature from the sidebar.

```html
channel.handleEvent('FeatureEvent', function(data) {
  if (data.operation !== 'click') {
    return;
  }
  // just the attractions added on default vector layer
  let clickedAttractions = data.features
    .filter(feat => feat.layerId === LAYER_ID)
    .map(feat => feat.geojson.features[0].properties.id);
  if (clickedAttractions.length) {
    featureClicked(clickedAttractions[0], true);
  }
});
```
We use the same featureClicked function as before but add one line there:

```html
HELPER.highlightMenu(id, scroll);
```
The function highlightMenu is given us allready in helper functions and highlights the sidebar attraction name for us.

Now we get the information by clicking the features, but next we wan't to get information by hovering the them.

6. Add hover functionality





