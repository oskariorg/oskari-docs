const LAYER_ID = 'attractions';
const IFRAME_DOMAIN = 'https://demo.oskari.org';
const MAP_EL = document.getElementById('map');
const channel = OskariRPC.connect(MAP_EL, IFRAME_DOMAIN);

var metadata;
channel.onReady(function() {
    //channel is now ready and listening.
    channel.log('Map is now listening');
    // getInfo can be used to get the current Oskari version
    channel.getInfo(function(oskariInfo) { 
       channel.log('Current Oskari-instance reports version as: ', oskariInfo);
       metadata = oskariInfo;
    });
    channel.postRequest('VectorLayerRequest', [{ 
      layerId: LAYER_ID,
      hover: STYLES.hover
    }]);
});
/*
channel.handleEvent('MapClickedEvent', function(data) {
  alert('Map clicked! At ' + data.lon + ', ' + data.lat + ' (' + metadata.srs + ')');
});
*/
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

function setFeatureStyle (id, style) {
  channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [{ 'id': id }, {
      layerId: LAYER_ID,
      featureStyle: style
  }]);
}