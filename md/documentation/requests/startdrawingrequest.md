# StartDrawingRequest

This request is used to activate a draw control on the map which allows the user to draw on the map.

## Examples

Start to draw for 'measure' functionality and keep the drawing on the map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['measure', 'line']);
```

After the drawing is completed a 'DrawingEvent' is triggered where id is 'measure' with the measure data available in event.getData().

Add a buffer of 50 units (metric/degrees(?)) for the line shape we got from the previous 'measure' event:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['measure', { ... geojson from the event ...}, {
    buffer : 50
}]);
```

Start to draw a point/dot for 'myplaces' functionality (disabling the buffer by dragging feature and don't setup edit control after finishing):
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['myplaces', 'dot', {
    buffer : 0,
    edit : false
}]);
```
Again on completion a 'DrawingEvent' is triggered with id 'myplaces' with the drawn shape as geojson available in event.getGeoJson().

Start to draw a polygon for 'myplaces' functionality with specific style and showing a label next to the drawing:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['myplaces', 'polygon', {
    label : 'My drawing'
    style : {
        "strokeColor": "#000000",
        "strokeOpacity": 1,
        "strokeWidth": 2,
        "fillColor": "#FF1207",
        "fillOpacity": 1,
        "pointRadius": 3,
        "fontColor": "#DE0500",
        "fontSize": "11px",
        "fontFamily": "Open+Sans",
        "fontWeight": "normal",
        "labelOutlineColor": "#FFFFFF",
        "labelOutlineWidth": 2,
        "labelXOffset": 9,
        "labelYOffset": 9,
        "cursor": "help"
    }
}]);
```
Again on completion a 'DrawingEvent' is triggered with id 'myplaces' with the drawn shape as geojson available in event.getGeoJson().
