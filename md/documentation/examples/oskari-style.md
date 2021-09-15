# Oskari style

JSON style object for styling layers. VisualizationForm component also supports getting and setting style values in Oskari style format.

## Use cases
- Define styling for vector layers handled by WfsVectorLayerPlugin
- Define styling for feature layers
- VisualizationForm

## Oskari style definition
All of the fields and objects defined here are optional in the Oskari style JSON. Anything can be omitted from the example below.


```javascript
{
    "fill": { // fill styles
        "color": "#FAEBD7", // fill color
        "area": {
            "pattern": -1 // fill style
        }
    },
    "stroke": { // stroke styles
        "color": "#000000", // stroke color
        "width": 1, // stroke width
        "lineDash": "solid", // line dash, supported: dash, dashdot, dot, longdash, longdashdot and solid
        "lineCap": "round", // line cap, supported: butt, round and square
        "lineJoin": "round" // line corner, supported: bevel, round and miter
        "area": {
            "color": "#000000", // area stroke color
            "width": 1, // area stroke width
            "lineDash": "dot", // area line dash
            "lineJoin": "round" // area line corner, supported: bevel, round and miter
        }
    },
    "text": { // text style
        "fill": { // text fill style
            "color": "#000000" // fill color
        },
        "stroke": { // text stroke style
            "color": "#ffffff", // stroke color
            "width": 1 // stroke width
        },
        "font": "bold 12px Arial", // font
        "textAlign": "top", // text align
        "offsetX": 12, // text offset x
        "offsetY": 12, // text offset y
        "labelText": "example", // label text
        "labelProperty": "propertyName" // read label from feature property
    },
    "image": { // image style
        "shape": 5, // 0-6 for default markers. svg or external icon path
        "size": 3, // Oskari icon size.
        "sizePx": 20, // Exact icon px size. Used if 'size' not defined.
        "offsetX": 0, // image offset x
        "offsetY": 0, // image offset y
        "opacity": 0.7, // image opacity
        "radius": 2, // image radius
        "fill": {
            "color": "#ff00ff" // image fill color
        }
    },
    "inherit": false, // For hover. Set true if you wan't to extend original feature style.
    "effect": "auto normal" // Requires inherit: true. Lightens or darkens original fill color. Values [darken, lighten, auto] and [minor, normal, major].
}
```

## Vector layer styling
Vector layer styling is stored in options field. Feature style overrides default style definitions for all features. Optional styles are used for specific features only which overrids default and feature style definitions. One named style has only one feature style and may have more than one optional styles.

```javascript
{
    "styles": {
        "Custom MVT style": {
            "featureStyle": {...},
            "optionalStyles": [{...}]
        }
    }
...
}
```

### WFS layer styling example
WFS layer options field:
```javascript
{
    "styles":{
        "Red lines": {
            "featureStyle": {
                "stroke": {
                    "color": "#ff0000"
                }
            }
        }
    }
}
```

## Hover style

Hover options describes how to visualize layer's features on hover and what kind of tooltip should be shown. Note that features isn't hovered while drawing is active (DrawTools).

```javascript
{
    featureStyle: {
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

## Optional styles
The styling definitions for optional style is same as above. Features that uses optional style are filtered with [Oskari filter](/documentation/examples/oskari-filter) definition by features' property keys and values. To filter features by different property keys you can use AND or OR operators.

### Optional style examples
To define style which is affected to featuers which regionCode is '091'.
```javascript
[{
    "property": {
        "key": "regionCode",
        "value": "091"
    },
    "fill": {
        "color": "#ff0000"
    }
}]
```

Filtering features with different property keys use AND and OR operators. To define style which is affected to features which type is 'city' or 'town' and population is greater than 10000.
```javascript
[{
    "AND": [{
        "key": "type",
        "in": ["city", "town"]
    }, {
        "key": "population",
        "greaterThan": 10000
    }],
    "image": {
        "shape": 5,
        "size": 4,
        "fill": {
            "color": "#3333ff"
        }
    },
    "text": {
        "labelProperty": "name"
    }
}]
```
To define style which is affected to features which surface property is 'tarmac' (case insensitive) or type is '\*road\*' or speedLimit is between 50 and 80 (begin and end values are included).

```javascript
[{
    "OR": [{
        "key": "surface",
        "value": "tarmac",
        "caseSensitive": false
    }, {
        "key": "type",
        "like": "road"
    }, {
        "key": "speedLimit",
        "atLeast": 60,
        "atMost": 100

    }],
    "stroke": {
        "color": "#ff0000",
        "width": 3
    }
}]
```

## Related bundles
[WFSVector](/api/bundles/#unreleased/mapping/wfsvector)

## Related API
[AddFeaturesToMapRequest](/api/requests/#unreleased/mapping/mapmodule/request/addfeaturestomaprequest)


[VectorLayerRequest](/api/requests/#unreleased/mapping/mapmodule/request/vectorlayerrequest)

## RPC examples
[Add or remove vector features](/examples/rpc-api/rpc_example.html)
