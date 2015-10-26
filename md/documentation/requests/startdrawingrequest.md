# StartDrawingRequest

This request is used to activate a draw control on the map which allows the user to draw on the map.

## Parameters

```javascript
* @param {String} id, that identifies the request
         * @param {String} shape: drawing shape: Point/Circle/Polygon/Box/Square/LineString
         * @param {Object} options include:
         * 					{Number} buffer: buffer for drawing buffered line and dot. If not given or 0, will disable dragging.
         * 					{Object} style: styles for draw, modify and intersect mode. If options don't include custom style, sets default styles
         * 					{Boolean} allowMiltipleDrawing: true - multiple selection is allowed, false - selection will be removed before drawing a new selection. Default is false.
         * 					{Boolean} drawControl: true - will activate draw control, false - will not activate. Default is true.
         * 					{Boolean} showMeasure: true - if measure result should be displayed on selection. Default is false.
         * 					{Boolean} modifyControl: true - will activate modify control, false, will not activate. Default is true.
         *      	 		{String} geojson: geojson for editing. If not given, will activate draw/modify control according to given shape.
         */
         
//For example:

var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', [
		id: 'bufferedLineSelection', 
		shape: 'LineString', 
		{
        	buffer: 200,
            allowMultipleDrawing: false,
			drawControl: true, 
            modifyControl: false,
            showMeasure: false                       	
        }		
);
```

## Examples

Start to draw for 'measure' functionality and keep the drawing on the map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['measure', 'LineString'], {
	showMeasure: true
});
```

After the drawing is completed a 'DrawingEvent' is triggered where id is 'measure' with the measure data available in event.getData().

Add a buffer of 50 units (metric) for the line shape we got from the previous 'measure' event:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['measure', 'LineString'], {
	buffer: 50
});
```

Start to draw a circle for 'myplaces' functionality (disabling the buffer by dragging feature and don't setup modify control after finishing):
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['myplaces', 'Circle', {
    buffer : 50,
    modifyControl : false
}]);
```
Again on completion a 'DrawingEvent' is triggered with id 'myplaces' with the drawn shape as geojson available in event.getGeoJson().

Start to draw a polygon for 'myplaces' functionality with specific style and showing a label next to the drawing:
```javascript

 var style = {
		draw : {
			fill : {
				 color: 'rgba(238,0,0,0.2)' 
			},
			stroke : {
	    	      color: 'rgba(0,0,0,1)',
	    	      width: 2
		},
		image : {
		      radius: 4,
		      fill: {
		        color: 'rgba(0,0,0,1)'
		      }
		}
	}, 
	modify : {
		fill : {
			 color: 'rgba(153,102,255,0.2)' 
		},
		stroke : {
		      color: 'rgba(0,0,0,1)',
		      width: 2
		},
		image : {
		      radius: 4,
		      fill: {
		        color: 'rgba(0,0,0,1)'
		      }
		}
	},
	intersect : {
		fill : {
			 color: 'rgba(101,255,102,0.2)' 
		},
		stroke : {
		      color: 'rgba(0,0,0,1)',
		      width: 2,
		      lineDash: 5
		},
		image : {
		      radius: 4,
		      fill: {
		        color: 'rgba(0,0,0,1)'
		      }
		}
	}
};

var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['myplaces', 'Polygon', {
    label : 'My drawing',
    style : style
}]);
```
Again on completion a 'DrawingEvent' is triggered with id 'myplaces' with the drawn shape as geojson available in event.getGeoJson().
