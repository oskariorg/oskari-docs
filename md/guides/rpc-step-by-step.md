# RPC step by step

Following this guide you'll be able to control published map from the parent document.

## What do I need?

* published map (map can be published for example at http://www.paikkatietoikkuna.fi/)
* OskariRPC.js (available on GitHub: https://github.com/nls-oskari/oskari/tree/master/libraries/OskariRPC)
* jschannel.js (available on GitHub: https://github.com/nls-oskari/oskari/tree/master/libraries/JSChannel)
* html-document where you want to get map with functionalities
* basic knowledge of javascript

## What's the aim of this example?

At this example we show published map at our webpage and control it from the parent document by clicking the map and getting coordinates of the clicked location. Marker is used  to mark the location of coordinates.

## Let's start!

**1. Define required libraries at your webpage**

Copy codes below to your html-page header and change the paths of .js files if needed.

```html
<script src="/js/rpc/JSChannel/jschannel.js"></script>
<script src="/js/rpc/OskariRPC/OskariRPC.js"></script>
```

**2. Copy the code of your published map to your website where you want it to occur and give id to the element**
    
Below is an example of the code of the published map

```html
<iframe id="publishedMap" src="http://www.paikkatietoikkuna.fi/published/fi/ab389bdd-f47c-43f8-b529-ae7789f53703"></iframe>
```
**3. Now let's add some javascript to handle map click**

```html
 <script>
    var channel = OskariRPC.connect(
      document.getElementById('publishedMap'),
      'http://www.paikkatietoikkuna.fi'
    ),
    coordinateDisplay = document.getElementById('coordinates'),
    coords = null,
    markerCounter = 0;

    channel.handleEvent(
    'MapClickedEvent',
        function(data) {

            if(markerCounter === 0) {
                channel.postRequest(
                    'MapModulePlugin.AddMarkerRequest', [{
                            x: data.lon,
                            y: data.lat
                        },
                        'RPCMarker' + markerCounter
                    ]
                );
                markerCounter++;
                setCoords(data.lon, data.lat);
            } else {
                channel.postRequest(
                    'MapModulePlugin.RemoveMarkersRequest', [],
                );
                markerCounter = 0;
                channel.postRequest(
                    'MapModulePlugin.AddMarkerRequest', [{
                            x: data.lon,
                            y: data.lat
                        },
                        'RPCMarker' + markerCounter
                    ],
                );
                markerCounter++;
                setCoords(data.lon, data.lat);
            }
        },
    );
    setCoords = function(x, y) {
        coordinateDisplay.value = x + ', ' + y;
    }
</script>
```
Let's take a closer look to the code. 
First we opened communications with the published map.
```javascript
var channel = OskariRPC.connect(
      document.getElementById('publishedMap'),
      'http://www.paikkatietoikkuna.fi'
    );
```
Then we defined some variables needed. MarkerCounter is used to count the amount of markers on the map so that we can remove the previous markers.
```javascript
var coordinateDisplay = document.getElementById('coordinates'),
    coords = null,
    markerCounter = 0;
```
Now that we have variables defined, we can add the function to handle map click. First we check if there is need to remove the previous marker and then we either remove it and add new marker or just add new marker. After adding new marker we call the function to tell us coordinates and give lon and lat as params.

```javascript
channel.handleEvent(
    'MapClickedEvent',
    function(data) {

        if(markerCounter === 0) {
            channel.postRequest(
                'MapModulePlugin.AddMarkerRequest', [{
                        x: data.lon,
                        y: data.lat
                    },
                    'RPCMarker' + markerCounter
                ]
            );
            markerCounter++;
            setCoords(data.lon, data.lat);
        } else {
            channel.postRequest(
                'MapModulePlugin.RemoveMarkersRequest', [],
            );
            markerCounter = 0;
            channel.postRequest(
                'MapModulePlugin.AddMarkerRequest', [{
                        x: data.lon,
                        y: data.lat
                    },
                    'RPCMarker' + markerCounter
                ],
            );
            markerCounter++;
            setCoords(data.lon, data.lat);
        }
    },
);
```
The last part of the code is show us coordinates. At this example we show them as alert to make it simple, but you can as well show them anywhere at your website the way you want.

```javascript
setCoords = function(x, y) {
    alert(x + ', ' + y);
}
```

Now we are ready with this example and you can start to develop your own code! Take a look at the [RPC bundle documentation](/documentation/bundles/framework/rpc) for getting advice! 