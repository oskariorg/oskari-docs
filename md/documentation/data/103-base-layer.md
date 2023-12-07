# Base/Group layer data structure

Base and group layers group together other layers and displayes them as one layer for the user. This is usually done so that different zoomlevels can have different wmsurls. The implementation is basically same for both, but base layers are moved to the bottom of the maplayer stack when added to map where as group layers are handled like normal layers and placed on top of the stack.

## Mandatory

* `id {String}`: Systems internal id for the layer (unique and cannot include characters reserved for css-selectors)
* `type {String}`: "base" for baselayer, "groupMap" for a group map
* `subLayer {Object[]}`: contains an array of layer JSONs (for example of type "wmslayer", base/group layer cant have a base/group layer as sublayer), note that sublayers should define min/maxscales so they are switched when zoomlevel changes.

## User interface properties

* `name {String}`: User interface name for the layer
* `orgName {String}`: Grouping name for the layer (optional, e.g. `layerselector2` shows layers grouped by this on "By data providers" tab)
* `inspire {String}`: Grouping name for the layer (optional, e.g. `layerselector2` shows layers grouped by this on "By theme" tab)
* `legendImage {String}`: URL pointing to a legend image for the layer (optional)

## Layer properties

* `opacity {Number}`: initial opacity for the layer (optional)
* `minScale {Number}`: minimum scale where the layer should be shown (optional)
* `maxScale {Number}`: maximum scale where the layer should be shown (optional)
* `permissions {Object}`: Contains permissions for the layer in format `permissionId : permissionValue` (optional, only used for publish permissions for now)

## Sample data

```json
{
    "type": "base",
    "id": "base_35",
    "name": "Base map",
    "orgName": "Base maps",
    "inspire": "Base maps",
    "subLayer": [
        // Array of WMS layers
    ]
}
```