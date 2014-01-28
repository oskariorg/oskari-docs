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