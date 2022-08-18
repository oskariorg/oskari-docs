import { HELPER } from "./helper";
import { STYLES } from "./styles";

const IFRAME_DOMAIN = "https://demo.oskari.org";
const MAP_EL = document.getElementById("map");
const channel = OskariRPC.connect(MAP_EL, IFRAME_DOMAIN);
let metadata;
channel.onReady(function (info) {
  //channel is now ready and listening.
  channel.log("Map is now listening", info);
  // getInfo can be used to get the current Oskari version
  channel.getInfo(function (oskariInfo) {
    channel.log("Current Oskari-instance reports version as: ", oskariInfo);
    metadata = oskariInfo;
  });
  // initialize layer to get hover style on the layer
  channel.postRequest("VectorLayerRequest", [
    {
      layerId: LAYER_ID,
      hover: STYLES.hover
    }
  ]);
});

/*
channel.handleEvent("MapClickedEvent", function (data) {
  alert(
    "Map clicked! At " + data.lon + ", " + data.lat + " (" + metadata.srs + ")"
  );
});
*/
const LAYER_ID = "attractions";
HELPER.getFeatures()
  .then(function (geojson) {
    let listUI = HELPER.getFeatureUI();
    // add attractions to side panel
    geojson.features.forEach((feature) => {
      const panel = HELPER.createFeaturePanel(feature);

      // on click -> update feature style
      panel.on("click", () => featureClicked(feature.properties.id));

      listUI.append(panel);
    });
    // add attractions to map
    channel.postRequest("MapModulePlugin.AddFeaturesToMapRequest", [
      geojson,
      {
        layerId: LAYER_ID,
        featureStyle: STYLES.normal
      }
    ]);
  })
  .catch(function (err) {
    // this is an error handler in case of network error
    alert(err);
  });

function setFeatureStyle(id, style) {
  channel.postRequest("MapModulePlugin.AddFeaturesToMapRequest", [
    { id: id },
    {
      layerId: LAYER_ID,
      featureStyle: style
    }
  ]);
}

let selectedFeature = null;

function featureClicked(id) {
  if (id === selectedFeature) {
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

channel.handleEvent("FeatureEvent", function (data) {
  if (data.operation !== "click") {
    // we are not interested in features being added or removed
    // so skip if not clicked
    return;
  }
  // filter out features that are not on our vector layer
  // and pick the id from attractions
  let clickedAttractions = data.features
    .filter((feat) => feat.layerId === LAYER_ID)
    .map((feat) => feat.geojson.features[0].properties.id);

  // if we hit one or more attractions -> select the first one
  if (clickedAttractions.length) {
    featureClicked(clickedAttractions[0]);
  }
});
