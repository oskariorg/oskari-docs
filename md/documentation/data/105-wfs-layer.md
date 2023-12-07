# WFS layer data structure

## General data

(selected from tables oskari_maplayer, oskari_layergroup, oskari_maplayer_metadata, oskari_maplayer_themes, oskari_permission, oskari-resource)

### Mandatory

* `id {String}`: Systems internal id for the layer (unique and cannot include characters reserved for css-selectors)
* `type {String}`: "wfslayer" for WFS layer
* `wmsUrl {String}`: base url for getting feature data
* `wmsName {String}`: In this case feature type name of WFS service

### User interface properties

* `name {String}`: User interface name for the layer
* `subtitle {String}`: additional description for the layer (optional, shown in `layerselection2`)
* `orgName {String}`: Grouping name for the layer (optional, e.g. `layerselector2` shows layers grouped by this on "By data providers" tab)
* `inspire {String}`: Grouping name for the layer (optional, e.g. `layerselector2` shows layers grouped by this on "By theme" tab)
* `legendImage {String}`: URL pointing to a legend image for the layer (optional)

### Layer properties

* `opacity {Number}`: initial opacity for the layer (optional)
* `minScale {Number}`: minimum scale where the layer should be shown (optional)
* `maxScale {Number}`: maximum scale where the layer should be shown (optional)
* `isQueryable {Boolean}`: not used for wfs layer
* `metaType {String}`: free text that can be used to find groups of layers with `MapLayerService.getAllLayersByMetaType` (optional)
* `geom {String}`: [A WKT string](​http://dev.openlayers.org/docs/files/OpenLayers/Format/WKT-js.html) - Bounding box where there should be actual content on the layer (optional)
* `permissions {Object}`: Contains permissions for the layer in format `permissionId : permissionValue` (optional, only used for publish permissions for now)
* `dataUrl_uuid {String}`: Id for layers metadata (optional, used for `catalogue.ShowMetadataRequest`)
* `style {String}`: not used for wfs layer - look at wfs spesific data
* `styles {Object[]}`: not used for wfs layer - look at wfs spesific data
* `params {Object}`: not used for wfs layer - look at wfs spesific data
* `options {Object}`: not used for wfs layer - look at wfs spesific data
* `attributes {Object}`: `Extra attributes for Oskari layer e.g. heatmap params (WMS) or manual-refresh-mode (WFS)` (optional)
* `realtime {Boolean}`: not used for wfs layer
* `refreshRate {Number}`: not used for wfs layer
* `srs_name {String}`: Coordinate reference system for WFS GetFeature request
* `version {String}`:  WFS service version 1.1.1 or 2.0
* `updated {Date}`:  Last update in layer definiton data in oskari_maplayer table


## WFS spesific layer properties

(wfs spesific data is not seen by the user, dat is selected from tables portti_wfs_layer, portti_wfs_layer_style, portti_wfs_layer_styles)

WFS versions 1.1.0 and 2.0  are supported. WFS 2.0. version is not yet supported for analysis

* `selectedFeatureParams {Object}`:  wfs feature properties to be selected for GFI - default is all
* `jobType`: `default` or empty for wfs 1.1.0 / `oskari-feature-engine` for wfs 2.0
* `getMapTiles {Boolean}`: Transport wfs is managing feature type rendering (image tiles)on a map, if true (default true)
* `layerName`: feature type name with namespace prefix
* `featureElement`: feature type name without namespace prefix
* `getHighlightImage {Boolean}`: Transport wfs is managing feature highlight image in GFI (default true)
* `GMLGeometryProperty`: Geometry property name of feature type
* `tileBuffer {Object}`: manages amount tiles to be buffered when drawing in transport. '{"default": 0.0, "oskari_custom": 1.0}' would take 1 additional tile as buffer
* `geometryNamespaceURI`:  namespace for geometry property, if not equal to featureNamespaceURI
* `featureType {Object}`: reserved for custom parser
* `maxFeatures`: Max number of features to be allowed to request in GetFeature request
* `isPublished {Boolean}`: Is Wfs layer allowed to be published
* `featureParamsLocales {Object}`: Locale names for selected feature properties
* `getFeatureInfo {Boolean}`: Transport wfs is managing feature properties (the other properties than geometry), if true (default true)
* `tileRequest {Boolean}`: Image is managed as one map tile (default false)
* `GML2Separator {Boolean}`: Default is false. If `true`, then there is special request parsing for Esri WFS GetFeature
* `featureNamespace`: Prefix of Feature namespace URI
* `GMLVersion`: gml version of WFS (featurecollection) in GetFeature request (3.1.1 (default for WFS 1.1.0) and 3.2 for WFS 2.0)
* `featureNamespaceURI`: Feature namespace URI
* `geometryType`: Geometry dimension in GML geometry points are x,y (2d) or x,y,z (3d) (not in use ?)


### Sample general data
```json
{
	admin: {
		inspireId: 21,
		organizationId: 57,
		password: "",
		url: "http://geo.stat.fi:8080/geoserver/vaestoruutu/ows",
		username: ""
	},
	attributes: {
		manualRefresh: true
	},
	baseLayerId: -1,
	created: "2015-07-07T14:02Z",
	id: 1336,
	inspire: "Väestöjakauma – demografia",
	isQueryable: true,
	layerName: "vaestoruutu:vaki2005_5km",
	legendImage: "",
	maxScale: 1,
	minScale: 15000000,
	name: {
		en: "Väestöruutuaineisto 5 km x 5 km 2005 (Default Path parser)",
		fi: "Väestöruutuaineisto5x5_2005 (WFS2.0 manual))",
		sv: "Väestöruutuaineisto 5 km x 5 km 2005 (Default Path parser)"
	},
	opacity: 100,
	options: {},
	orgName: "Tilastokeskus",
	params: {},
	permissions: {
		download: "download_permission_ok",
		edit: true,
		publish: "publication_permission_ok"
	}
	realtime: false,
	refreshRate: 0,
	srs_name: "EPSG:3067",
	style: "default",
	styles: [],
	subtitle: {
		en: "",
		fi: "",
		sv: ""
	},
	type: "wfslayer",
	updated: "2015-07-07T14:02Z",
	url: "http://geo.stat.fi:8080/geoserver/vaestoruutu/ows",
	version: "2.0.0",
	wmsName: "vaestoruutu:vaki2005_5km",
	wmsUrl: "http://geo.stat.fi:8080/geoserver/vaestoruutu/ows"
}
```

### Sample wfs spesific data

```json
{
	"selectedFeatureParams": {},
	"jobType": "default",
	"getMapTiles": true,
	"layerName": "tieliikenne:tieliikenne_2011",
	"featureElement": "tieliikenne_2011",
	"password": "",
	"getHighlightImage": true,
	"username": "",
	"GMLGeometryProperty": "the_geom",
	"tileBuffer": {},
	"geometryNamespaceURI": "",
	"featureType": {},
	"maxFeatures": 2000,
	"maxScale": 1,
	"URL": "http://geo.stat.fi/geoserver/tieliikenne/wfs?",
	"isPublished": false,
	"featureParamsLocales": {},
	"getFeatureInfo": true,
	"tileRequest": false,
	"styles": {},
	"layerId": "1337",
	"WFSVersion": "1.1.0",
	"GML2Separator": false,
	"minScale": 1.5E7,
	"SRSName": "EPSG:3067",
	"featureNamespace": "tieliikenne",
	"GMLVersion": "3.1.1",
	"attributes": "{\\"
	manualRefresh\\ ":true}",
	"featureNamespaceURI": "http://geoserv.stat.fi/geoserver/tieliikenne",
	"uiName": "Tieliikenneonnettomuudet 2011 manual",
	"geometryType": "2d"
}
```


