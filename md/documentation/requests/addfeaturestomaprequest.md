# AddFeaturesToMapRequest

Vector features can be added on the map by AddFeaturesToMapRequest. The request must contain the geometries of the features. Optionally, also additional control options such as features' style can be provided in a JSON-object.

The geometry must be provided either as a WKT-string or a GeoJSON - object, e.g.

WKT
```javascript
var WKT = "POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322, 382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))";
```

GeoJSON
```javascript
var geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3067'
        }
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[488704, 6939136], [489704, 6949136]]
          },
          'properties': {
            'test_property': 1
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [488704, 6939136]
          },
          'properties': {
            'test_property': 2
          }
        }
      ]
};
```

Options object
```javascript
{
    layerId: 'MY_VECTOR_LAYER', 
    replace: 'replace',
    layerOptions: {
    	minResolution: 0, 
    	maxResolution: 1000
    },
    centerTo: true,
    featureStyle: null,
    attributes: null
}
```
<ul>
	<li>
		<b>layerId</b> - In case you want to add features on a specified layer (if the layer does not exist one will be created). Needed, if at a later point you need to be able to remove features on only that specific layer. 
	</li>
	<li>
		<b>replace</b> - with the value 'replace' the previous vectors will be cleared
	</li>
	<li>
		<b>layerOptions</b> - additional options of the layer.  
	</li>
	<li>
		<b>centerTo</b> - Whether to zoom to the added features.
	</li>
	<li>
		<b>featureStyle</b> - A style object.
	</li>
	<li>
		<b>attributes</b> - Feature's attributes, especially handy when the geometry is a WKT-string.
	</li>
</ul>

##Usage example (ol3)

```javascript
var x = 488704, y = 6939136;
var geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3067'
        }
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[x, y], [x+1000, y+1000]]
          },
          'properties': {
            'test_property': 1
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [x, y]
	      },
	      'properties': {
	        'test_property': 2
	      }
        }

      ]
    };

var layerOptions = {
    'minResolution': 2,
    'maxResolution': 100
};

var featureStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#3399CC',
        width: 5
    })
});

var rn = 'MapModulePlugin.AddFeaturesToMapRequest';

this.getSandbox().postRequestByName(rn, [geojsonObject, {
    layerId: 'MY_VECTOR_LAYER',
    replace: 'replace',
    layerOptions: null,
    centerTo: false,
    featureStyle: featureStyle,
    attributes: null
}]);
```
