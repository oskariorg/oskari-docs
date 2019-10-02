# FOSS4G2019 Oskari workshop

This document guides you through the Oskari workshop describing the steps needed to embed a map to a webpage and control it using Oskari RPC functionality. In this workshop we will:

1. publish a map from https://demo.oskari.org or other Oskari instance
2. embed the map to a webpage
3. add attractions in Bucharest to the map
4. add interaction between the map and the page to get information about the attractions.

## Initial preparations

In this workshop we use CodePen for the development so you only need a browser (like Chrome) to participate. You don't need to install any software or setup a server.

1. Sign up / Log in to CodePen (https://codepen.io)
2. Open https://codepen.io/oskariotter/project/editor/ZLxjEv and click "Fork" to copy the template under your own user

As an example and a starting point the template has a full screen placeholder for a map that is lime green. The template also includes helper scripts that will let us skip some of the coding that is not related to Oskari.

You can preview a finished product of what we will be creating here: 
https://codepen.io/zakarfin/project/editor/ZdNWjV# (created with demo.oskari.org) 
https://codepen.io/sannajokela/project/full/ZLxOpQ (created with www.paikkatietoikkuna.fi)

and the sources are also available in [GitHub](https://github.com/oskariorg/oskari-docs/tree/master/md/documentation/examples/FOSS4G_2019).

## First look

You should now have a CodePen project that you can edit with files:

- index.html
- poi.json ==> this file contains sights from Bucharest, you can create your own POI data e.g. with QGIS (check the used coordinate system and be sure it is the same as the embedded map from Oskari)
- styles/index.scss
- scripts/helper.js
- scripts/styles.js
- scripts/index.js

Note! If you have some webserver running on your laptop you can just as easily use your favorite editor for creating this. Just run the code on your computer if you have an environment to serve static files for a browser (files opened without a server might not work properly).

## Adding the map aka "It's not easy being green"

1. Open https://demo.oskari.org or other Oskari instance that allows embedded map functionality
2. Log in using credentials user/user
3. Click 'MAP PUBLISHING'
4. Insert details about the map:
- Address: 'codepen.plumbing' to make it accessible from CodePen project
- Map name: Something that will let you identify your map since we will all use the same user
- Scroll the map to show Bucharest as the attractions are going to be around there
5. Click 'Save' and copy the HTML-snippet for an iframe to your clipboard

```
<iframe src="https://demo.oskari.org/?lang=en&uuid=93235644-944d-466c-85c0-46945f75ff33" allow="geolocation" style="border: none; width: 100%; height: 100%;"></iframe>
```
6. Open `index.html` in your CodePen project and replace `<div id="map"></div>` with the iframe.
7. Add `id="map"` on the `iframe` tag so our styles (in `styles/index.scss`) affect it

## First contact

To interact with the map we need a small JavaScript library called Oskari RPC client for the page. You can find it in npm and GitHub but for maximum compatibility with CodePen we will hotlink it from oskari.org. 

Add the script tag in `index.html` next to the other script tags where it says:

`<!-- Include RPC client library here -->`
```html
<script src="https://oskari.org/js/rpc/rpc-client.min.js"></script>
```

In production apps we recommend using the library from official repositories:

- https://www.npmjs.com/package/oskari-rpc
- https://github.com/oskariorg/rpc-client

That's the html code so far. Let's take a closer look at the JavaScript.

Open the `scripts/index.js` file in the editor and add the following (check that the iframe domain is correct if you are using another Oskari instance than demo.oskari.org):
 
```javascript
const IFRAME_DOMAIN = 'https://demo.oskari.org';
const MAP_EL = document.getElementById('map');
const channel = OskariRPC.connect(MAP_EL, IFRAME_DOMAIN);
var metadata;
channel.onReady(function (info) {
    //channel is now ready and listening.
    channel.log('Map is now listening', info);
    // getInfo can be used to get the current Oskari version
    channel.getInfo(function(oskariInfo) {
       channel.log('Current Oskari-instance reports version as: ', oskariInfo);
       metadata = oskariInfo;
    });
});
```

First we initialize a connection to the map. We need to pass `connect()` a reference to the map iframe and give it the domain where the map was published from (the `IFRAME_DOMAIN` must match to the source domain in the iframe). We get a reference to `channel` from the `connect()` that we can use for interacting with the map. Once the connection is made the `onReady()` callback is called on the `channel`.

You can query information about the map "environment" by calling `channel.getInfo()`. Most of the operations on RPC are asynchronous so we will be using callback-functions that get called once we have the response. The metadata we get from `getInfo()` includes the coordinate reference system used by the map that we should use when we interact with the map and things like version of the Oskari instance that we are interacting with. 

The Oskari version tells us what version of the API is running on the map and is directly linked to the version of API documentation in:

- https://oskari.org/api/requests#1.52.0
- https://oskari.org/api/events#1.52.0

Not all the functionalities are available through RPC so there's a filter on the API documentation to show only those requests and events that are relevant to RPC (The RPC only checkbox).

Now when you run the app you should see the message `Map is now listening` on developer console (opened by F12 on the keyboard). The connection can also be tested without the developer console by adding a snippet that tells the coordinates of a clicked location:

```javascript
channel.handleEvent('MapClickedEvent', function(data) {
  alert('Map clicked! At ' + data.lon + ', ' + data.lat + ' (' + metadata.srs + ')');
});
```

Now that we are familiar with the basic setup let's start building our own map application showing the attractions of Bucharest!

You can remove the snippet with `MapClickedEvent` from the project as we don't need that after testing everything was ok.

## Add attractions to map

A geojson including five attractions in Bucharest can be found in the file named `poi.json` in the CodePen project. There is also a helper function that reads the file and returns a Promise-object containing the features (`HELPER.getFeatures()`).

Let's use the RPC request `AddFeaturesToMapRequest` to add the attractions on the map. Open the `scripts/index.js` file on CodePen and add this snippet to it:

```javascript
const LAYER_ID = 'attractions';
HELPER.getFeatures().then(function(geojson) {
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
    layerId: LAYER_ID,
    featureStyle: STYLES.normal
  }]);
}).catch(function (err) {
  alert(err);
});
```
We use another helper (`STYLES`) here for shortening the code and using predefined styles for the map. You can find the style definition in `scripts/styles.js`. You can find out the styling options here: https://www.oskari.org/documentation/examples/oskari-style

Now we can see the attractions on a map but it doesn't give us very much information of them. Let's add a side panel for showing the names and other information of attractions.

## Adding a side panel

The template already includes a navigation element as a placeholder for the side panel. We can modify the CSS a bit to show it. Open `styles/index.scss` and modify the `left` property under `#map` from 0 to 25%:

```css
#map { 
  /* Map element placement */
  ...
  left: 25%;
  ...
} 
```

After this the map doesn't cover the whole page any more and we have a side panel next to it with a heading 'Attractions in Bucharest'.

## List attractions on side panel

We can modify the code where we added attractions to the map (in `scripts/index.js`) to also add them to the side panel on the page. There's some more helper functions to help you with this. They get you easy access to the HTML elements (`HELPER.getFeatureUI()` gives you reference to the side panel) on the page and output HTML for a given feature (`HELPER.createFeaturePanel()`) so you don't have to type it in yourself. 

Each attraction will be listed in it's own collapsible panel so that the information can be seen by clicking the name of the attraction. We add code for populating the side panel to the same getFeatures() handling we used in previous step. You should *replace* the previous `HELPER.getFeatures()` functions with the following one:

```javascript
HELPER.getFeatures().then(function(geojson) {
  let listUI = HELPER.getFeatureUI();
  // add attractions to side panel
  geojson.features.forEach(feature => {
    const panel = HELPER.createFeaturePanel(feature);
    listUI.append(panel);
  });
  // add attractions to map
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
    layerId: LAYER_ID,
    featureStyle: STYLES.normal
  }]);
}).catch(function (err) {
  // this is an error handler in case of network error
  alert(err);
});
```

After this you should see the attractions on the side panel. Now we need to add some functionality to create the link between the side panel and the map.

## Highlight attraction on map

Next we will add interaction between the side panel and the map. We want to highlight features on the map when they are clicked on the panel. Feature styles can be updated  using the same request as adding features (`AddFeaturesToMapRequest`) but giving a filter object matching feature properties that is used to identify feature(s) to be updated and the updated style. Here we use id to select a single feature as we only want to change the style of one feature.

Let's add a helper function in `scripts/index.js` to update a style of a feature by id:

```javascript
function setFeatureStyle (id, style) {
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [{ 'id': id }, {
      layerId: LAYER_ID,
      featureStyle: style
  }]);
}
```

Now let's modify the code that adds attractions to the UI and add a click listener on each attraction panel to update the style of the matching feature. Again, you can *replace* the `HELPER.getFeatures()` function with the following one:

```javascript
HELPER.getFeatures().then(function(geojson) {
  let listUI = HELPER.getFeatureUI();
  // add attractions to side panel
  geojson.features.forEach(feature => {
    const panel = HELPER.createFeaturePanel(feature);

    // on click -> update feature style
    panel.on('click', () => setFeatureStyle(feature.properties.id, STYLES.selected));

    listUI.append(panel);
  });
  // add attractions to map
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
    layerId: LAYER_ID,
    featureStyle: STYLES.normal
  }]);
}).catch(function (err) {
  // this is an error handler in case of network error
  alert(err);
});
```

After this the attractions on a map are highlighted when clicked on the side panel. There's a problem though. The previously highlighted feature is not reset when another is clicked so you will eventually end up with all the features having the highlighted style.

Let's add some more code in `scripts/index.js` to fix this:

```javascript
var selectedFeature = null;

function featureClicked (id) {
  if (id == selectedFeature) {
    return;
  }
  if (selectedFeature) {
    // reset style on previously selected
    setFeatureStyle(selectedFeature, STYLES.normal);
  }
  // update the selected feature and highlight the feature
  selectedFeature = id;
  setFeatureStyle(id, STYLES.selected);
}
```

Now let's modify the `click` handler on the features loop to use the new function instead of calling `setFeatureStyle()`:

```javascript
    // on click -> update feature style
    panel.on('click', () => featureClicked(feature.properties.id));
```

Now the style of the previously selected feature is reset before new selection is highlighted.

The index.js should now include the following code:

```javascript
/**
 * index.js
 * - All our useful JS goes here, awesome!
 */

console.log("JavaScript is amazing!");
const IFRAME_DOMAIN = 'https://demo.oskari.org';
const MAP_EL = document.getElementById('map');
const channel = OskariRPC.connect(MAP_EL, IFRAME_DOMAIN);
var metadata;
channel.onReady(function (info) {
    //channel is now ready and listening.
    channel.log('Map is now listening', info);
    // getInfo can be used to get the current Oskari version
    channel.getInfo(function(oskariInfo) {
       channel.log('Current Oskari-instance reports version as: ', oskariInfo);
       metadata = oskariInfo;
    });
});

const LAYER_ID = 'attractions';
HELPER.getFeatures().then(function(geojson) {
  let listUI = HELPER.getFeatureUI();
  // add attractions to side panel
  geojson.features.forEach(feature => {
    const panel = HELPER.createFeaturePanel(feature);

    // on click -> update feature style
    panel.on('click', () => featureClicked(feature.properties.id));

    listUI.append(panel);
  });
  // add attractions to map
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
    layerId: LAYER_ID,
    featureStyle: STYLES.normal
  }]);
}).catch(function (err) {
  // this is an error handler in case of network error
  alert(err);
});

function setFeatureStyle (id, style) {
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [{ 'id': id }, {
      layerId: LAYER_ID,
      featureStyle: style
  }]);
}

var selectedFeature = null;

function featureClicked (id) {
  if (id == selectedFeature) {
    return;
  }
  if (selectedFeature) {
    // reset style on previously selected
    setFeatureStyle(selectedFeature, STYLES.normal);
  }
  // update the selected feature and highlight the feature
  selectedFeature = id;
  setFeatureStyle(id, STYLES.selected);
}
```

Now we know where the attractions are on a map but what if we want to know which feature on the map is which attraction? We need to react to feature clicks on the map and highlight the matching attraction on the side panel.

## Catching clicks

When a feature is clicked on the map a `FeatureEvent` is triggered. It is also triggered when a feature is added or removed but we want to focus on clicks and the event has an `operation` property to indicate what actually happened. The event also includes any features that were "hit" by the click. Let's listen to `FeatureEvent` and highlight the name of the clicked feature from the side panel.

This snippet should be added to `scripts/index.js`:

```javascript
channel.handleEvent('FeatureEvent', function(data) {
  if (data.operation !== 'click') {
    // we are not interested in features being added or removed
    // so skip if not clicked
    return;
  }
  // filter out features that are not on our vector layer
  // and pick the id from attractions
  let clickedAttractions = data.features
    .filter(feat => feat.layerId === LAYER_ID)
    .map(feat => feat.geojson.features[0].properties.id);

  // if we hit one or more attractions -> select the first one
  if (clickedAttractions.length) {
    featureClicked(clickedAttractions[0]);
  }
});
```
We use the same `featureClicked()` function as before but add one line `HELPER.highlightMenu(id)`:

```javascript
function featureClicked(id) {
  if (id == selectedFeature) {
    return;
  }
  HELPER.highlightMenu(id);
  ... the rest of the function...
}
```
The `highlightMenu()` function highlights the attraction on the side panel and is part of the helper functions as it's just HTML handling which is not the focus of this workshop. By using the same function we get the benefit of not needing to care if the feature was clicked on the map or on the menu and can just do the stuff that should happen if an attraction is selected by any means.

Now the index.js should include the following functions:

```javascript
/**
 * index.js
 * - All our useful JS goes here, awesome!
 */

console.log("JavaScript is amazing!");
const IFRAME_DOMAIN = 'https://demo.oskari.org';
const MAP_EL = document.getElementById('map');
const channel = OskariRPC.connect(MAP_EL, IFRAME_DOMAIN);
var metadata;
channel.onReady(function (info) {
    //channel is now ready and listening.
    channel.log('Map is now listening', info);
    // getInfo can be used to get the current Oskari version
    channel.getInfo(function(oskariInfo) {
       channel.log('Current Oskari-instance reports version as: ', oskariInfo);
       metadata = oskariInfo;
    });
});

const LAYER_ID = 'attractions';
HELPER.getFeatures().then(function(geojson) {
  let listUI = HELPER.getFeatureUI();
  // add attractions to side panel
  geojson.features.forEach(feature => {
    const panel = HELPER.createFeaturePanel(feature);

    // on click -> update feature style
    panel.on('click', () => featureClicked(feature.properties.id));

    listUI.append(panel);
  });
  // add attractions to map
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [geojson, {
    layerId: LAYER_ID,
    featureStyle: STYLES.normal
  }]);
}).catch(function (err) {
  // this is an error handler in case of network error
  alert(err);
});

function setFeatureStyle (id, style) {
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [{ 'id': id }, {
      layerId: LAYER_ID,
      featureStyle: style
  }]);
}

var selectedFeature = null;

function featureClicked (id) {
  if (id == selectedFeature) {
    return;
  }
  HELPER.highlightMenu(id);
  if (selectedFeature) {
    // reset style on previously selected
    setFeatureStyle(selectedFeature, STYLES.normal);
  }
  // update the selected feature and highlight the feature
  selectedFeature = id;
  setFeatureStyle(id, STYLES.selected);
}

channel.handleEvent('FeatureEvent', function(data) {
  if (data.operation !== 'click') {
    // we are not interested in features being added or removed
    // so skip if not clicked
    return;
  }
  // filter out features that are not on our vector layer
  // and pick the id from attractions
  let clickedAttractions = data.features
    .filter(feat => feat.layerId === LAYER_ID)
    .map(feat => feat.geojson.features[0].properties.id);

  // if we hit one or more attractions -> select the first one
  if (clickedAttractions.length) {
    featureClicked(clickedAttractions[0]);
  }
});
```
Our app is almost ready now. We have attractions on the side panel and on the map and we get the information about them no matter how we select them. Next we make it easier to see what attraction the feature is by hovering on it.

## Hovering like there's no tomorrow

To make it easier to identify attractions on the map we are going to show the name of the attraction when the mouse cursor is on top of it. For getting a hover style on the map we need to initialize the layer we are using with `VectorLayerRequest`.

Modify the callback for `channel.onReady()` in `scripts/index.js` by adding this to the end of the function:

```javascript
channel.onReady(function () {
    // there can be some code at the start of the function that is mostly logging
    // you can remove it or leave it and add this at the end:

    // initialize layer to get hover style on the layer
    channel.postRequest('VectorLayerRequest', [{ 
      layerId: LAYER_ID,
      hover: STYLES.hover
    }]);
});
```

Now you should see a small popup next to an attraction when you move your mouse on top of one.

## Thank you!!

Sources for this workshop: https://github.com/oskariorg/oskari-docs/tree/master/md/documentation/examples/FOSS4G_2019

Additional resources for pushing forward:

- https://oskari.org/
- https://oskari.org/examples/rpc-api/rpc_example.html
- https://oskari.org/api/requests
- https://oskari.org/api/events
- https://www.oskari.org/documentation/examples/oskari-style
- https://github.com/oskariorg
- https://twitter.com/oskari_org
- https://gitter.im/oskariorg/chat
- Mailing list: Oskari-user@lists.osgeo.org
 
 ## Disclaimers and things to look out for

 Note that we will be erasing the database on demo.oskari.org periodically so the embedded maps published today might not be there tomorrow. You can setup your own Oskari instance by following the instructions on https://oskari.org.

If you want to use React when building an RPC-based app we have an example of such https://github.com/oskariorg/rpc-client/tree/master/examples/react

 You can follow changes between versions that _might_ break an RPC-based application by checking https://github.com/oskariorg/oskari-frontend/blob/master/api/CHANGELOG.md (also visible as API-documention root). To see the Oskari version of a instance you can use  `channel.getInfo()` in RPC. It's wise to trigger an update email in your app if the expected version changes so you can check that your app wasn't broken by an Oskari version update on the instance you have published your map from. We try to maintain backwards compatibility within reason but can't affect when or how a given Oskari instance is updated.
