# WMS layer data structure

## Mandatory

* `id {String}`: Systems internal id for the layer (unique and cannot include characters reserved for css-selectors)
* `type {String}`: "wmslayer" for WMS layer
* `wmsUrl {String}`: base url for getting tile images for the layer
* `wmsName {String}`: mapped to OpenLayers WMS `layers` and `layerId` parameters

## User interface properties

* `name {String}`: User interface name for the layer
* `subtitle {String}`: additional description for the layer (optional, shown in `layerselection2`)
* `orgName {String}`: Grouping name for the layer (optional, e.g. `layerselector2` shows layers grouped by this on "By data providers" tab)
* `inspire {String}`: Grouping name for the layer (optional, e.g. `layerselector2` shows layers grouped by this on "By theme" tab)
* `legendImage {String}`: URL pointing to a legend image for the layer (optional)

## Layer properties

* `opacity {Number}`: initial opacity for the layer (optional)
* `minScale {Number}`: minimum scale where the layer should be shown (optional)
* `maxScale {Number}`: maximum scale where the layer should be shown (optional)
* `isQueryable {Boolean}`: true if the layer supports `GetFeatureInfo` functionality (optional)
* `metaType {String}`: free text that can be used to find groups of layers with `MapLayerService.getAllLayersByMetaType` (optional)
* `geom {String}`: [A WKT string](​http://dev.openlayers.org/docs/files/OpenLayers/Format/WKT-js.html) - Bounding box where there should be actual content on the layer (optional)
* `permissions {Object}`: Contains permissions for the layer in format `permissionId : permissionValue` (optional, only used for publish permissions for now)
* `dataUrl_uuid {String}`: Id for layers metadata (optional, used for `catalogue.ShowMetadataRequest`)
* `style {String}`: Name of the default style (optional)
* `styles {Object[]}`: Style options for the layer, title is shown in ui, name is used for layer operations, legend is style specific legendImage (optional)
* `params {Object}`: `OpenLayers.Layer.WMS` params (optional)
* `options {Object}`: `OpenLayers.Layer.WMS` options (optional)
* `attributes {Object}`: `Extra attributes for Oskari layer e.g. heatmap params (WMS) or manual-refresh-mode (WFS)` (optional)
* `realtime {Boolean}`: `Is WMS layer managed as real time layer` (optional, default false)
* `refreshRate {Number}`: `Refresh rate for realtime WMS-layer (unit min) (optional, default 0)
* `srs_name {String}`: Supported coordinate reference system for WMS layer
* `version {String}`:  WMS service version 1.3.0 or 1.1.1
* `updated {Date}`:  Last update in WMS layer definiton data in oskari_maplayer table

## Sample data
```json
{
  "id":27,
  "type":"wmslayer",
  "wmsUrl":"http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta",
  "wmsName":"cells",
  
  "name":"Elektroniset merikartat (ENC)",
  "subtitle":"Liikennevirasto",
  "orgName":"Liikennevirasto",
  "inspire":"Liikenneverkot",
  "legendImage":"http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-203&FORMAT=image/png&WIDTH=200&HEIGHT=402",

  "opacity":75,
  "minScale":2000000,
  "maxScale":1,
  "isQueryable":true,
  "metaType":"water",
  
  "permissions":{
     "publish":"no_publication_permission"
  },
  "dataUrl_uuid":"1d1c8600-76bf-4e1f-bd09-b5c154ca30dc",
  "geom":"POLYGON ((51857.07713547576 6617351.7548736315, 199877.68017894187 7795699.643159997, 674163.7062640898 7782724.689402027, 759905.4332841737 6599589.557011408, 51857.07713547576 6617351.7548736315))",
  "style":"style-id-201",
  "styles":[
     {
        "title":"Standard",
        "legend":"http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-200&FORMAT=image/png&WIDTH=200&HEIGHT=402",
        "name":"style-id-200"
     },
     {
        "title":"Standard - Transparent Land",
        "legend":"http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-201&FORMAT=image/png&WIDTH=200&HEIGHT=402",
        "name":"style-id-201"
     },
     {
        "title":"Full",
        "legend":"http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-202&FORMAT=image/png&WIDTH=200&HEIGHT=402",
        "name":"style-id-202"
     },
     {
        "title":"Full - Transparent Land",
        "legend":"http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-203&FORMAT=image/png&WIDTH=200&HEIGHT=402",
        "name":"style-id-203"
     }
  ]
}
```


```json
{
attributes: {},
baseLayerId: -1,
created: "2015-04-15T15:04Z",
dataUrl_uuid: "3018dc34-cb48-4ce3-ad3e-24f83afcc03a",
formats: {
	value: "text/html",
	available: ["text/html", "text/plain", "application/vnd.ogc.gml"]
},
geom: "POLYGON ((-28465.09977713914 6561743.172749533, 676613.827779925 6529420.701555437, 610260.5731762389 7899947.404660257, 170485.38149829634 7922212.34012629, -28465.09977713914 6561743.172749533))"
gfiContent: "",
id: 1303,
inspire: "Korkeus",
isQueryable: true,
layerName: "syvyyskayra_v",
legendImage: "",
name: "Syvyyskäyrät",
opacity: 100,
options: {},
orgName: "Liikennevirasto",
params: {},
permissions: {
	publish: "no_publication_permission"
},
realtime: false,
refreshRate: 0,
style: "",
styles: [{
	title: "Syvyyskäyrä",
    continue: "..."
}],
subtitle: "",
type: "wmslayer",
updated: "2015-04-15T15:04Z",
url: "/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&id=1303&action_route=GetLayerTile",
version: "1.3.0",
wmsName: "syvyyskayra_v",
wmsUrl: "https://extranet.liikennevirasto.fi/inspirepalvelu/rajoitettu/wms"
}
```