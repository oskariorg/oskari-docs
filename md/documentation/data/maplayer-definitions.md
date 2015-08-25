# Maplayer definitions

Oskari supports map layer types listed below. Support for more layer types can be added to the system by registering custom layer models and builders (see Extending with custom type). Maplayers are represented as JSON and parsed into Oskaris internal models by `createMapLayer` function in `Oskari.mapframework.service.MapLayerService`. The parsed layers can then be added to the system by calling `addLayer`, removed from the system by calling `removeLayer` or updated after it has been added with `updateLayer`. The `MapLayerService` provides functions to find layers added to the system etc.

When layers are added to the map the added layer domain object can be requested with `sandbox.findAllSelectedMapLayers` or you can check if a layer is already added to the map with `sandbox.isLayerAlreadySelected(<layerId>)`.

## Supported layer types

### Abstract Layer (**since version 1.6**)

Abstract Layer implements common functionality for all layers. All layers should extend the Abstract Layer and not use the Abstract Layer directly. Layers extending `Oskari.mapframework.domain.AbstractLayer` needs to define `this._layerType` to function properly. Abstract Layer constructor parameters params and options can be passed and replaces default values (since version **1.8**).

### WMS Layer

WMS layer are used to display data from OGC Web Mapping Services. It consists of image tiles forming up the map. The domain class can be found here. The plugin displaying the layer is under `mapmodule/plugins`.

[data format explained](/documentation/data/wms-layer)

#### Base Layer and Group Layer

Baselayer is a a group of WMS layers that has a common parent/metadata layer with concrete WMS layers with wmsurls as sublayers. Baselayers are always added to the bottom of the layer stack on map. Grouplayer is basically the same thing as baselayer but it is treated as a normal layer when added to the stack of layers on map. Both use the same domain/mapplugin classes than WMS-layer.

[data format explained](/documentation/data/base-layer)

### WFS Layer

**OBS! Backend functionality required for use.**

WFS layer is based on features described with GML as opposed to WMS image tiles. Oskari implementation of WFS layers uses serverside functionality to render image tiles of the WFS data and display them as a WMS layer. This is done so features can be rendered to the map quickly. Especially older browser (and older machines) cannot draw substantial amounts of features on the client side without a significant lag.

WFS layers can be queried and data for the features displayed in the view port can be shown on a data table. WFS features can also be highlighted by clicking them on map or by selecting it in the data table. This functionality is implemented in bundles `mapwfs2` (display) and `featuredata` (data table).

See [here](https://github.com/nls-oskari/oskari/blob/master/docs/md/architecture/wfs.md) and [here](http://oskari.org/documentation/architecture/wfs) for more complete documentation.

[data format explained](/documentation/data/wfs-layer)

### WMTS Layer

WMTS layer allows viewing of tiles from a service that implements the OGC WMTS specification version 1.0.0.

The `mapwmts` bundle handles any wmts related operations from parsing layer JSON to domain object to displaying it on screen.

### Stats Layer (**since version 1.6**)

Stats layer allows viewing statistics from a service that will be described in more detail later.

The `mapstats` bundle handles any statistics related operations.

### Analysis Layer

Work in progress

### MyPlaces Layer

Work in progress

### ArcGIS Layer

Layer type `arcgis93layer`  is for ArcGis rest service. Rendering and GFI is supported. Use `Map Layer Administration` module to add ArcGis layers.

GFI is not supported for ArcGis Rest group layer

[data format explained](/documentation/data/arcgis93layer)

## Extending with custom type

After creating `Oskari.mapframework.service.MapLayerService` you can register custom layer model builders for the custom layer type. This must be done before any layers of the custom type is being parsed by `MapLayerService.createMapLayer` function.

The builder is registered like this:

```javascript
var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
    layerModelBuilder = Oskari.clazz.create('<builder class definition>');

mapLayerService.registerLayerModel('<custom layer type>','<custom layer domain definition>');
mapLayerService.registerLayerModelBuilder('<custom layer type>',layerModelBuilder);
```

Concrete example how mapfull bundle adds support for wmts:

```javascript
var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');

mapLayerService.registerLayerModel('wmtslayer','Oskari.mapframework.wmts.domain.WmtsLayer');
mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);
```

See `Oskari.mapframework.service.MapLayerServiceModelBuilder` for API documentation.

Simplest case of custom domain layer object must define (**since version 1.6**):

```javascript
this._layerType = "CustomLayerType";
```

### Sample WfsLayer extending Abstract Layer (**since version 1.6**)

```javascript
/**
 * MapLayer of type WFS
 *
 * @class Oskari.mapframework.domain.WfsLayer
 */
Oskari.clazz.define('Oskari.mapframework.domain.WfsLayer',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /* Layer Type */
    this._layerType = "WFS";
}, {
   /* Layer type specific functions */
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});
```

## Pre version 1.6

Methods that custom layer domain object must implement (see `WmsLayer` for API documentation):

```javascript
setId({String});
getId(); -> {String}
setName({String});
getName(); -> {String}
setOpacity({Number});
getOpacity(); -> {Number}
setMaxScale({Number});
getMaxScale(); -> {Number}
setMinScale({Number});
getMinScale(); -> {Number}
setDescription({String});
getDescription(); -> {String}
setMetadataIdentifier({String});
getMetadataIdentifier(); -> {String}
setOrganizationName({String});
getOrganizationName(); -> {String}
setInspireName({String});
getInspireName(); -> {String}
setVisible({Boolean});
isVisible({Boolean}); ->
addPermission({String}, {String});  
getPermission({String}); -> {String}

isInScale({Number}) -> {Boolean}
isLayerOfType({String}) -> {Boolean}
hasLegendImage() -> {Boolean}
isGroupLayer() -> {Boolean}
isBaseLayer() -> {Boolean}
setAsNormalLayer();
```