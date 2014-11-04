# RPC

<table class="table">
  <tr>
    <td>ID</td><td>rpc</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.rpc.RemoteProcedureCallInstance.html)</td>
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
        width: 700px;
        height: 525px;
    }
</style>
<iframe id="Oskari" src="http://demo.paikkatietoikkuna.fi/published/fi/8184"></iframe>
<button id="helsinki">Messukeskus</button>
<button id="lehka">Lehijärvi</button>
<output id="coords"></output>
<script>
    var channel = OskariRPC.connect(
            document.getElementById('Oskari'),
            'http://demo.paikkatietoikkuna.fi'
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
                    console.log('MapMoveRequest posted');
                },
                function(error, message) {
                    console.log('error', error, message);
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
                        console.log('getMapPosition', JSON.stringify(data));
                        moveMap(data.centerX, data.centerY, zoomLevel);
                    },
                    function(error, message) {
                        console.log('error', error, message);
                    }
                );
            };
            document.body.appendChild(zoombar);
        },
        function(error, message) {
            console.log('error', error, message);
        }
    );

    // Get current map position
    channel.getMapPosition(
        function(data) {
            console.log('getMapPosition', JSON.stringify(data));
            setCoords(data.centerX, data.centerY);
        },
        function(error, message) {
            console.log('error', error, message);
        }
    );

    channel.getAllLayers(
        function(data) {
            console.log('getAllLayers', JSON.stringify(data));
            // Layer names aren't available through RPC as it might contain sensitive data
            var localization = {
                '24': 'Ortokuvat',
                'base_2': 'Maastokartta',
                'base_35': 'Taustakarttasarja'
            };
            data.forEach(function(layer) {
                var layerButton = document.createElement('button');
                layerButton.id = layer.id;
                layerButton.textContent = localization[layer.id];
                layerButton.onclick = function() {
                    var lid = this.id;
                    console.log('Showing layer ' + localization[lid]);
                    data.forEach(function(l) {
                        channel.postRequest(
                            'MapModulePlugin.MapLayerVisibilityRequest',
                            [
                                l.id,
                                l.id + '' === lid
                            ]
                        );
                    });
                };
                document.body.appendChild(layerButton);
            });
        },
        function(error, message) {
            console.log('error', error, message);
        }
    );

    channel.handleEvent(
        'AfterMapMoveEvent',
        function(data) {
            console.log('AfterMapMoveEvent', JSON.stringify(data));
            setCoords(data.centerX, data.centerY);
            if (zoombar) {
                zoombar.value = data.zoom;
            }
        },
        function(error, message) {
            console.log('error', error, message);
        }
    );

    channel.handleEvent(
        'MapClickedEvent',
        function(data) {
            console.log('MapClickedEvent', JSON.stringify(data));
            channel.postRequest(
                'MapModulePlugin.AddMarkerRequest', [{
                        x: data.lon,
                        y: data.lat
                    },
                    'RPCMarker'
                ],
                function(error, message) {
                    console.log('error', error, message);
                }
            );
        },
        function(error, message) {
            console.log('error', error, message);
        }
    );

    document.getElementById('lehka').onclick = function() {
        console.log('Lehijärvi');
        moveMap(354490.70442968, 6770658.0402485);
    };

    document.getElementById('helsinki').onclick = function() {
        console.log('Messukeskus');
        moveMap(385597.68323541, 6675813.1806321);
    };
</script>

## Bundle configuration

No configuration is required, but it can be used to defined allowed functions, events and requests.
If not set, sane defaulst will be used instead.

The default search UI can be disable through config.

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
    <td> RPC library </td>
    <td> Used at both ends of the pipe for the RPC communication.</td>
  </tr>
</table>
