# RPC

<table class="table">
  <tr>
    <td>ID</td><td>rpc</td>
  </tr>
  <tr>
    <td>API</td><td>[link](/api/latest/classes/Oskari.mapframework.bundle.rpc.RemoteProcedureCallInstance.html)</td>
  </tr>
</table>

## Description

Provides RPC functionality, i.e. a published map can be controlled from the parent document.

## Example

<script src="/js/rpc/JSChannel/jschannel.js"></script>
<script src="/js/rpc/OskariRPC/OskariRPC.js"></script>
<style>
    iframe {
        background-clip: padding-box;
        border: none;
        border-radius: 12px;
        box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.15);
        clear: both;
        display: block;
        margin-bottom: 12px;
        width: 740px;
        height: 525px;
    }
    #rpcControls {
        text-align: center;
        width: 740px;   
    }

    #rpcControls button,
    #rpcControls output,
    #rpcControls input {
        display: inline-block;
        margin-top: 6px;
    }
</style>
<iframe id="Oskari" src="http://www.paikkatietoikkuna.fi/published/fi/f8ad2bf1-eaf0-44ff-ac90-de4fe3077812"></iframe>
<div id="rpcControls">
    <button id="mml">MML</button>
    <button id="helsinki">Messukeskus</button>
    <button id="lehka">Lehijärvi</button>
    <output id="coords"></output>
</div>
<script>
    var channel = OskariRPC.connect(
            document.getElementById('Oskari'),
            'http://www.paikkatietoikkuna.fi'
        ),
        coords = document.getElementById('coords'),
        setCoords = function(x, y) {
            coords.textContent = x + ', ' + y;
        },
        moveMap = function(centerX, centerY, zoomLevel) {
            channel.postRequest(
                'MapMoveRequest',
                [
                    centerX,
                    centerY,
                    zoomLevel === undefined ? 9 : zoomLevel
                ],
                function(data) {
                    if (console && console.log) {
                        console.log('MapMoveRequest posted');
                    }
                },
                function(error, message) {
                    if (console && console.log) {
                        console.log('error', error, message);
                    }
                }
            );
        },
        showGFI = function (lon, lat) {
            channel.postRequest(
                'MapModulePlugin.GetFeatureInfoRequest',
                [
                    lon,
                    lat
                ],
                function(data) {
                    if (console && console.log) {
                        console.log('GetFeatureInfoRequest posted');
                    }
                },
                function(error, message) {
                    if (console && console.log) {
                        console.log('error', error, message);
                    }
                }
            );
        },
        zoombar;

    channel.getZoomRange(
        function(data) {
            zoombar = document.createElement('input');
            zoombar.type = 'range';
            zoombar.min = data.min;
            zoombar.max = data.max;
            zoombar.value = data.current;
            zoombar.onchange = function(event) {
                var zoomLevel = this.value;
                // There's no setZoomLevel for now, so we use MapMoveRequest with
                // getMapPosition's x and y coords
                channel.getMapPosition(
                    function(data) {
                        if (console && console.log) {
                            console.log('getMapPosition', JSON.stringify(data));
                        }
                        moveMap(data.centerX, data.centerY, zoomLevel);
                    },
                    function(error, message) {
                        if (console && console.log) {
                            console.log('error', error, message);
                        }
                    }
                );
            };
            document.getElementById('rpcControls').appendChild(zoombar);
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    // Get current map position
    channel.getMapPosition(
        function(data) {
            if (console && console.log) {
                console.log('getMapPosition', JSON.stringify(data));
            }
            setCoords(data.centerX, data.centerY);
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    channel.getAllLayers(
        function(data) {
            if (console && console.log) {
                console.log('getAllLayers', JSON.stringify(data));
            }
            // Layer names aren't available through RPC as it might contain sensitive data
            var localization = {
                '24': 'Orthophotos',
                'base_2': 'Topographic map',
                'base_35': 'Background map serie'
            };
            var gfiLayerId = '343';
            data.forEach(function(layer) {
                if (layer.id + '' !== gfiLayerId) {
                    var layerButton = document.createElement('button');
                    layerButton.id = layer.id;
                    layerButton.textContent = localization[layer.id];
                    layerButton.onclick = function() {
                        var lid = this.id;
                        if (console && console.log) {
                            console.log('Showing layer ' + localization[lid]);
                        }
                        data.forEach(function(l) {
                            channel.postRequest(
                                'MapModulePlugin.MapLayerVisibilityRequest',
                                [
                                    l.id,
                                    l.id + '' === lid || l.id + '' === gfiLayerId
                                ]
                            );
                        });
                    };
                    document.getElementById('rpcControls').appendChild(layerButton);
                }
            });
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    channel.handleEvent(
        'AfterMapMoveEvent',
        function(data) {
            if (console && console.log) {
                console.log('AfterMapMoveEvent', JSON.stringify(data));
            }
            setCoords(data.centerX, data.centerY);
            if (zoombar) {
                zoombar.value = data.zoom;
            }
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    channel.handleEvent(
        'MapClickedEvent',
        function(data) {
            if (console && console.log) {
                console.log('MapClickedEvent', JSON.stringify(data));
            }
            channel.postRequest(
                'MapModulePlugin.AddMarkerRequest', [{
                        x: data.lon,
                        y: data.lat
                    },
                    'RPCMarker'
                ],
                function(error, message) {
                    if (console && console.log) {
                        console.log('error', error, message);
                    }
                }
            );
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    document.getElementById('lehka').onclick = function() {
        if (console && console.log) {
            console.log('Lehijärvi');
        }
        moveMap(354490.70442968, 6770658.0402485);
    };

    document.getElementById('helsinki').onclick = function() {
        if (console && console.log) {
            console.log('Messukeskus');
        }
        moveMap(385597.68323541, 6675813.1806321);
    };

    document.getElementById('mml').onclick = function () {
        if (console && console.log) {
            console.log('MML GFI');
        }
        moveMap(385587.00507322, 6675359.2539665);
        showGFI(385587.00507322, 6675359.2539665);
    };
</script>

## Bundle configuration

No configuration is required, but it can be used to define allowed functions,
events and requests.
If not set, sane defaults will be used instead.

### Allowed functions

Allowed functions (config.allowedFunctions) lists all the functions that can be called over rpc.
Defaults at the moment are:
```javascript
{
    'InfoBox.ShowInfoBoxRequest': true,
    'MapModulePlugin.AddMarkerRequest': true,
    'MapModulePlugin.GetFeatureInfoRequest': true,
    'MapModulePlugin.MapLayerVisibilityRequest': true,
    'MapModulePlugin.RemoveMarkersRequest': true,
    MapMoveRequest: true
}
```

### Allowed events

Allowed events (config.allowedEvents) lists all the events that can be listened to over rpc.
Defaults at the moment are:
```javascript
{
    "AfterMapMoveEvent": true,
    "MapClickedEvent": true
}
```

### Allowed requests

Allowed requests (config.allowedRequests) lists all the requests that can be sent over rpc.
Defaults at the moment are:
```javascript
{
    'MapModulePlugin.AddMarkerRequest': true,
    'MapModulePlugin.GetFeatureInfoRequest': true,
    'MapModulePlugin.MapLayerVisibilityRequest': true,
    'MapModulePlugin.RemoveMarkersRequest': true,
    MapMoveRequest: true
}
```

## Using the bundle functionality

First of all, the bundle's configuration must have a "domain" value, that will be checked against the communication origin.
```javascript
{
    "domain": "oskari.org"
}
```
If you're using the Oskari backend, this is injected automatically based on the domain set for the published map.

Next we'll need a map and the required libraries:
```html
<script src="/js/rpc/JSChannel/jschannel.js"></script>
<script src="/js/rpc/OskariRPC/OskariRPC.js"></script>
<iframe id="Oskari" src="http://demo.paikkatietoikkuna.fi/published/fi/8184"></iframe>
```

Here we open communications with the published map:
```html
<script>
var channel = OskariRPC.connect(
    document.getElementById('Oskari'),
    'http://demo.paikkatietoikkuna.fi'
);
</script>
```

Then we call a function:
```javascript
// Get current map position
channel.getMapPosition(
    function(data) {
        console.log(
            'getMapPosition',
            data.centerX,
            data.centerY
        );
    },
    function(error, message) {
        console.log('error', error, message);
    }
);
```

Then add an event listener:
```javascript
channel.handleEvent(
    'AfterMapMoveEvent',
    function(data) {
        console.log(
            'AfterMapMoveEvent',
            data.centerX,
            data.centerY
        );
    },
    function(error, message) {
        console.log('error', error, message);
    }
);
```

And post a request:
```javascript
channel.postRequest(
    'MapModulePlugin.AddMarkerRequest',
    [
        {
            x: 354490.70442968,
            y: 6770658.0402485
        },
        'RPCMarker'
    ],
    function(error, message) {
        console.log('error', error, message);
    }
);
```

## Bundle state

No statehandling has been implemented for the bundle.

## Requests the bundle handles

This bundle doesn't handles any requests.

## Requests the bundle sends out

Depends wholly on the setup.

## Events the bundle listens to

Depends wholly on the setup.

## Events the bundle sends out

This bundle doesn't send any events.

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose</th>
  </tr>
  <tr>
    <td> [JSChannel](https://github.com/mozilla/jschannel) </td>
    <td> RPC bundle </td>
    <td> Used at both ends of the pipe for the RPC communication.</td>
  </tr>
</table>
