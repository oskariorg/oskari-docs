# Oskari style

JSON style object for styling layers. See example usages in AddFeaturesToMapRequest or Vector Tile Layer Plugin. VisualizationForm component also supports getting and setting style values in Oskari style format.

All of the fields and objects defined here are optional in the Oskari style JSON. Anything can be omitted from the example below.

Definition/example:

```
"featureStyle/optionalStyle": {
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