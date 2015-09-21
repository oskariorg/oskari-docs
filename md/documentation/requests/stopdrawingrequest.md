# StopDrawingRequest

If the user is allowed to draw on the map this request can be used to complete the drawing and/or clear the drawing from the map.

## Examples

Complete a draw for 'measure' functionality and keep the drawing on the map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StopDrawingRequest', ['measure']);
```

This expects that drawing has been started for id 'measure' and will result in an 'DrawingEvent' where id is 'measure' with the measure data available in event.getData().

Complete a draw for 'myplaces' functionality and clear the drawing from the map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StopDrawingRequest', ['myplaces', true]);
```
Again, this expects that drawing has been started for id 'myplaces' and will result in an 'DrawingEvent' where id is 'myplaces' with the drawn shape as geojson available in event.getGeoJson().
