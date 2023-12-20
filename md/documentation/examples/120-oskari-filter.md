# Oskari filter

JSON filter object for filttering features by features' property keys and values.

## Use cases
- Define filter for optional styles
- Define filter for WFS layer

Oskari filter definition:
```javascript
{
    "property": {
        "key": "type", // feature's property name
        
        // Operators
        "value": "road" || 10000 || true // equal comparison
        "in": ["tarmac","sand", "gravel"], // for multiple possible values (OR)
        "notIn": ["sand", "gravel"], // for multiple possible NOT values (OR)
        "like": "tarm*", // for a pattern tarm*
        "notLike": "*tarm*", // for a NOT pattern *tarm*

        // Operators for numerical comparison
        "greaterThan": 60, // strictly greater than
        "atLeast": 60, // greater than or equal to
        "lessThan": 80, // strictly  less than
        "atMost": 80, // less than or equal to

        // Case sensivity for value, in, notIn, like and notLike operators
        "caseSensitive": false
    },
    "AND": [...], // to add multiple conditions with AND operator
    "OR": [...] // to add multiple conditions with OR operator
}
```
Property filter should have key and one operator. Key defines which feature's property and operator which comparison operator are used for filttering. For range filters two operators can be used in same property filter. If additional definitions are given then filter doesn't work as intended.

## Filtered WFS layer
WFS layer filter is stored in attributes field. If layer has filter then GetFeature requests are made with bbox and specified property filter.

### WFS layer filter examples
To have WFS layer that contains only features which have regionCode property value '091'. CQL: regionCode = '091'
```javascript
{
    "filter": {
        "property": {
            "key": "regionCode",
            "value": "091"
        }
    }
}
```

To have WFS layer that contains only features which have population between 10000 and 200000 (begin and end values are excluded). CQL: population > 10000 and population < 200000
```javascript
{
    "filter": {
        "property": {
            "key": "population",
            "greaterThan": 10000,
            "lessThan": 200000
        }
    }
}
```
To have WFS layer that contains only features which regionCode '091' and serviceType is 'school', 'pre-school' or 'high-school'. CQL: regionCode = '091' and (serviceType = 'school' or serviceType = 'pre-school' or serviceType = 'high-school')

```javascript
{
    "filter": {
        "AND": [{
            "key": "regionCode",
            "value": "091"
        }, {
            "key": "serviceType",
            "in": ["school", "pre-school", "high-school"]
        }]
    }
}
```

## Oskari style
Using filter with optional styles see:
[Oskari style](/documentation/examples/oskari-style#optional-styles)
