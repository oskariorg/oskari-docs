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
Optional style examples:

```
"optionalStyles":[{
    "property": {
        "value": 50,
        "key": "naiset_p",
        "operator": "greater" // greater, greaterEqual, less, lessEqual, like, equal, between, betweenEqual
    },
    "fill": {
        "color": "#FF0000"
    }
    }, {
    "property": {
        "value": [0,50],
        "key": "naiset_p",
        "operator": "between"
    },
    "fill": {
        "color": "#0000FF"
    }
}];
```

AND, OR, NOT
values in array (NOT single value).
```
"optionalStyles":[{
    "property": {
        "value": ["linna", "kylä", "järvi"],
        "key": "nimi",
        "logical": "OR", // AND, OR, NOT
        "operator": "like" // greaterEqual, less, lessEqual, like, equal, between, betweenEqual
    },
    "fill": {
        "color": "#0000FF"
    }
```

Like in WFS feature filtering
```
"optionalStyles":[{
    "filter": [
        {
            "caseSensitive":false,
            "attribute":"kkonn",
            "operator":"=",
            "value":"5"
        }, {
            "boolean":"AND"
        }, {
            "caseSensitive":false,
            "attribute":"onntyyppi",
            "operator":"=",
            "value":"3"
        }, {
            "boolean":"OR"
        }, {
            "caseSensitive":false,
            "attribute":"onntyyppi",
            "operator":">",
            "value":"7"
        }, {
            "boolean":"AND"
        }, {
            "caseSensitive":false,
            "attribute":"vvonn",
            "operator":"=",
            "value":"5"
        }
    ],
    "fill": {
        "color": "#FF0000"
    }
}];
```

GeoStyler:
```
"filter": [
    "&&",
    [
        "*=",
        "nimi",
        "linna"
    ],
    [
        "||",
        [
        "==",
        "maara",
        "1"
        ],
        [
        "==",
        "maara",
        "10"
        ]
    ]
],
"symbolizers": []
```

How should multi optional styles work:
- Should we take first matching style or loop all and use last styling

```
"features" [
    {
        "name": "Helsinki",
        "population": "5000000"
    }
];

optionalStyles":[{
    "property": {
        "value": "Helsinki",
        "key": "name"
    },
    "fill": {
        "color": "#0000FF"
    }
}, {
     "property": {
        "value": 5000000,
        "key": "population"
    },
    "fill": {
        "area": {
            "pattern": 3
        }
    }
}
```
