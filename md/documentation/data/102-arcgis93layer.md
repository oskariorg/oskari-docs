# ArcGis layer data structure

Layertype `arcgis93layer`
Structure is like WMS/WFS layer, look at sample data

## Mandatory

* `id {String}`: Systems internal id for the layer (unique and cannot include characters reserved for css-selectors)
* `type {String}`: "arcgis93layer" for ArcGis Rest layer
* `wmsUrl {String}`: base url for getting image and GFI  use rest/export url
* `wmsName {String}`: use ArcGis layer name id for the name. GFI is not supported for group layer


## Sample data

```json
{
	admin: {
		inspireId: 22,
		organizationId: 91,
		password: "",
		url: "http://85.76.241.90/ArcGIS/rest/services/Maakuntakaava_2040/Kaava2040REST/MapServer/export",
		username: ""
	},
	attributes: {},
	baseLayerId: -1,
	created: "2015-08-25T15:18Z",
	id: 1322,
	inspire: "Aluesuunnittelu ja rajoitukset",
	layerName: "0",
	legendImage: "",
	maxScale: 1,
	minScale: 15000000,
	name: {
		en: "ArcGistest",
		fi: "ArcGistest",
		sv: "ArcGistest"
	},
	opacity: 100,
	options: {},
	orgName: "aTeam Oskari",
	params: {},
	permissions: {
		download: "download_permission_ok",
		edit: true,
		publish: "publication_permission_ok"
	},
	realtime: false,
	refreshRate: 0,
	srs_name: "EPSG:3067",
	subtitle: {
		en: "",
		fi: "",
		sv: ""
	}
	type: "arcgis93layer",
	updated: "2015-08-25T15:18Z",
	url: "http://85.76.241.90/ArcGIS/rest/services/Maakuntakaava_2040/Kaava2040REST/MapServer/export",
	version: "1.0.0",
	wmsName: "0",
	wmsUrl: "http://85.76.241.90/ArcGIS/rest/services/Maakuntakaava_2040/Kaava2040REST/MapServer/export"
}
```
