# Oskari style

JSON style object for styling layers. VisualizationForm component also supports getting and setting style values in Oskari style format.

All of the fields and objects defined here are optional in the Oskari style JSON. Anything can be omitted from the example below.

## Use cases
- Define styling for WFS layers handled by WfsVectorLayerPlugin
- Define styling for feature layers
- VisualizationForm

Oskari style definition:

```javascript
{
    "fill": { // fill styles
        "color": "#ff00ff", // fill color
        "area": {
            "pattern": -1 // fill style
        }
    },
    "stroke": { // stroke styles
        "color": "#ff00ff", // stroke color
        "width": 3, // stroke width
        "lineDash": "dot", // line dash, also supported: dash, dashdot, longdash, longdashdot or solid
        "lineCap": "but", // line cap, also supported: round or square
        "area": {
            "color": "#ff00ff", // area stroke color
            "width": 3, // area stroke width
            "lineDash": "dot", // area line dash
            "lineJoin": "mitre" // area line corner
        }
    },
    "text": { // text style
        "fill": { // text fill style
            "color": "#0000ff" // fill color
        },
        "stroke": { // text stroke style
            "color": "#ff00ff", // stroke color
            "width": 4 // stroke width
        },
        "font": "bold 12px Arial", // font
        "textAlign": "top", // text align
        "offsetX": 12, // text offset x
        "offsetY": 12, // text offset y
        "labelText": "example", // label text
        "labelProperty": "propertyName" // read label from feature property
    },
    "image": { // image style
        "shape": "marker.png", // external icon
        "size": 3, // Oskari icon size.
        "sizePx": 20, // Exact icon px size. Used if 'size' not defined.
        "offsetX": 0, // image offset x
        "offsetY": 0, // image offset y
        "opacity": 0.7, // image opacity
        "radius": 2, // image radius
        "fill": {
            "color": "#ff00ff" // image fill color
        }
    }
}
```
## Layer styling
WFS layer styling is stored in options field.
```javascript
{
  "Custom MVT style": {
    "featureStyle": {...},
    "optionalStyles": [{...}]
  },
  ...
}
```

## Optional style filttering

The styling definitions for optional style is same as above but in optional style you also need to specify the feature it is used for with property object. To filter features by different property keys you can use AND or OR properties. Use only one (or two for ranges) value definition. If additional definitions is given then first definion takes place (order in below).

```javascript
{
    property: {
        key: 'id', // feature property what checked for use optional style
        caseSensitive: true, // should string comparison

        // For number values
        greaterThan: 60, // strictly greater than
        atLeast: 60, // greater than or equal to
        lessThan: 80, // strictly  less than
        atMost: 80, // less than or equal to
        // For ranges use two of above

        // For string values
        like: 'tarm' || ['tarmac','sand', 'gravel'], // feature property string value includes
        notLike: 'tarm' || ['tarmac','sand'], // includes not

        // For string and number values
        in: ['tarmac','sand', 'gravel'], // multiple equality
        notIn: ['sand', 'gravel'], // multiple equality not
        value: '' // equal

        // Regular expression
        regexp: '' // the text of the regular expression
    },
    AND: [], // to add multiple properties
    OR: [], // to add multiple properties
    stroke: {},
    fill: {},
    image: {},
    text: {}
}
```

## Hover style

Hover options describes how to visualize layer's features on hover and what kind of tooltip should be shown. Note that features isn't hovered while drawing is active (DrawTools).

```javascript
{
    // Apply hover style only on features having property "class" with value "building"
    filter: [
        {key: 'class', value: 'building'}
    ],
    featureStyle: { // TODO should this be removed
        inherit: true,
        effect: 'darken',
        // Oskari style definitions
        fill,
        stroke,
        image,
        text
    },
    // Tooltips content as an array. Each object creates a row to the tooltip.
    content: [
        // "key" is a label and will be rendered as is.
        { key: 'Feature Data' },
        // "valueProperty" and "keyProperty" are fetched from the feature's properties.
        { key: 'Feature ID', valueProperty: 'id' },
        { keyProperty: 'name', valueProperty: 'value' }
    ]
}
```

Filtering features with different property keys:
```javascript
[{
    AND: [{
        key: 'id',
        in: [1, 5, 12]
    }, {
        key: 'type',
        value: 'road'
    }],
    stroke: {},
    fill: {},
    image: {},
    text: {}
}]
```
Defined style options are affected featuers which type is 'road' and id is 1, 5 or 12.

```javascript
[{
    OR: [{
        key: 'surface',
        value: 'tarmac',
        caseSensitive: false
    }, {
        key: 'type',
        like: 'path'
    }, {
        key: 'speedLimit',
        atLeast: 50,
        atMost: 80

    }],
    stroke: {},
    fill: {},
    image: {},
    text: {}
}]
```
Defined style options are affected featuers which surface property is 'tarmac' (case insensitive)or type is '*path*' or speedLimit is between 50 and 80 (begin and end values are included).

## RPC examples
[Add or remove vector features](/examples/rpc-api/rpc_example.html)

## Related bundles
[WFSVector](/api/bundles/mapping/wfsvector)

## Related api
[VectorLayerRequest](/api/requests/#unreleased/mapping/mapmodule/request/vectorlayerrequest)

[AddFeaturesToMapRequest](/api/requests/#unreleased/mapping/mapmodule/request/addfeaturestomaprequest)
