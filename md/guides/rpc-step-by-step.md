# RPC step by step

This guide will tell you how to control a published map from the parent document.

## What do I need?

* published map (map can be published for example at http://www.paikkatietoikkuna.fi/)
* OskariRPC.js (available on GitHub: https://github.com/nls-oskari/rpc-client)
* jschannel.js (available on GitHub: https://github.com/yochannah/jschannel)
* The html-document in which you want to use a map with functionalities
* basic knowledge of javascript

## What's the aim of this example?

In this example we show a published map on our webpage and control it from the parent document by clicking the map and getting coordinates of the clicked location. Marker is used to mark the location of coordinates.

## Let's start!

**1. Define required libraries at your webpage**

Copy the code below to your html-page header and change the paths of .js files if needed.

```html
<script src="/js/rpc/JSChannel/jschannel.js"></script>
<script src="/js/rpc/OskariRPC/OskariRPC.js"></script>
```

**2. Copy the code of your published map to your website where you want it to occur and give an id to the element**
    
Below is an example of the code for a published map

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
                    'MapModulePlugin.RemoveMarkersRequest', []
                );
                markerCounter = 0;
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
            }
        },
    );
    setCoords = function(x, y) {
        coordinateDisplay.value = x + ', ' + y;
    }
</script>
```
Let's take a closer look at the code.
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
Now that we have variables defined, we can add the function to handle map click. First we check if there is need to remove the previous marker and then we either remove it and add a new marker or just add a new marker. After adding new marker we call the function to tell us coordinates and give lon and lat as params.

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
                'MapModulePlugin.RemoveMarkersRequest', []
            );
            markerCounter = 0;
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
        }
    },
);
```
The last part of the code is to show us the coordinates. In this example we show them as an alert to keep things simple, but you can as well show them anywhere on your website the way you want.

```javascript
setCoords = function(x, y) {
    alert(x + ', ' + y);
}
```

Now we are ready with this example and you can start to develop your own code. Take a look at the [RPC bundle documentation](/documentation/bundles/framework/rpc) for more advice.