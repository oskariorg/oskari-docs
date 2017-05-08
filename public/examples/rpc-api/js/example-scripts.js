// Constants
var DEVELOP = false;
var IFRAME_DOMAIN = 'http://demo.paikkatietoikkuna.fi';
var USER_MARKER_ID = 'REPORT_MARKER';
var MARKER_ID = 'RPC_MARKER';
var LAYERS_ENV = ["base_35"];
var LAYERS_ROAD = ["base_35",455];
var LOCATION_KUOPIO = [533031, 6973199];
var LOCATION_POSIO = [552935, 7332639];
var MARKER_TEMPLATE = _.template(
  '<li class="list-group-item marker_${id}">' +
        '<h5>${name}</h5>' +
        '<div class="desc">${desc}</div>' +
    '</li>');

if(DEVELOP){
    IFRAME_DOMAIN = 'http://localhost:8080';
    jQuery('#publishedMap').prop('src', 'http://localhost:8080/web/fi/kartta?uuid=f3642ad2-f78c-4db3-b23e-2f7d0524cf55&p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&published=true');
}

//init code highlighting
hljs.initHighlightingOnLoad();

function moveMap(x, y, zoomLevel) {
    channel.postRequest(
        'MapMoveRequest', [x, y, zoomLevel]
    );
}

function addMarker(marker, id) {
    // get missing id from marker if available
    if(!id) {
        id = marker.id;
    }
    channel.postRequest(
        'MapModulePlugin.AddMarkerRequest', [marker, id]
    );
}

function displayMessage(message, tout) {
    var timeOut = 5,
        text = jQuery('.messageBox').text(message);
        if (tout) {
            timeOut = tout;
        }
        var escaped = jQuery('<div>').text(message).text();
        jQuery('.messageBox').html(escaped.replace(/\n/g, '<br />'));
        jQuery('.messageBox').css("display", "block");
        jQuery('.messageBox').fadeIn();
        setTimeout(function () {
            jQuery('.messageBox').fadeOut();
            jQuery('.messageBox').css("display", "none");
        }, timeOut * 1000);
}

function checkMapRotation() {
  //check if SetRotationRequest is availabe, if true append option to optgroup
    channel.getSupportedRequests(function(allowed){
      if(allowed['rotate.map']){
          jQuery('optgroup[label|="Requests"]').append('<option value="rotate">Rotate map</option>');
      }
    });
}

/* Plot mm size rectange in scale on the map
* e.g.  A4   size 210 mm x 297 mm
* @param plotAreaData  [[mm_measure1, mm_measure2,...], scale]e.g. [210,297], 10000]
*/
function plotPlotArea (plotAreaData) {

    channel.getPixelMeasuresInScale(plotAreaData, function (data) {
        //Log output data
        channel.log('GetPixelMeasuresInScale: ', data);
        // Plot rectangle in the middle of map
        var cx = jQuery('#publishedMap');
        var pos = cx.position();
        var box_top = pos.top + (cx.height() - data.pixelMeasures[1] ) / 2.0;
        var box_left = pos.left + (cx.width() - data.pixelMeasures[0] ) / 2.0;

        cx.parent().find('#id_plot_bbox').remove();

        if (box_left > 0 && box_top > 0) {

            /* Example with svg rectangle and center point
             var center_x = data.pixelMeasures[0] / 2.0;
             var center_y = data.pixelMeasures[1] / 2.0;
             var svg ='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="'+cx.width() +
             '" height="'+cx.height()+ '" id="id_plot_bbox" style="overflow: hidden;pointer-events:none; position:absolute;' +
             'top:'+box_top+'px; left:'+box_left+'px;">' +
             '<g> <circle cx="'+center_x+'" cy="'+center_y+'" r="7.5" stroke-width="0.875" style="stroke:#ec008d; fill: none;" opacity=".7" id="plot_center"></circle> ' +
             '<rect x="0" y="0" width="'+a4[0]+'" height="'+a4[1]+'" stroke-width="2px" style="stroke:#f00; fill: none;" id="plot_bbox"></rect>' +
             '</g> </svg>';

             cx.parent().find('#id_plot_bbox').remove();
             cx.parent().append(svg);  */

            // Simple div sample
            var box =
                    '<div id="id_plot_bbox" style=" overflow: hidden;pointer-events:none; position:absolute; ' +
                    'top:' + box_top +
                    'px;' +
                    'left:' + box_left + 'px; ' +
                    'width:' + data.pixelMeasures[0] + 'px; ' +
                    'height:' + data.pixelMeasures[1] + 'px; border:2px solid red"> </div>';

            cx.parent().append(box);
        }


    });

}
/**
 * Sample to plot route leg steps ans intermediate stops
 * @param {Object}
 * @param boolean  clear previous
 */
function plotRouteStops (itinerary, clearPrevious) {
    var data = {
        color: "ff0000",
        msg : '',
        shape: 5,
        size: 3
    };
    if(itinerary.legs){
        if(clearPrevious){
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', []);
        }
        // Loop Legs
        for (var i in itinerary.legs) {
            var leg = itinerary.legs[i];
            data.x = leg.from.lon;
            data.y = leg.from.lat;
            data.color = "ff0000";
            channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, 'marker_from_'+i]);
            data.x = leg.to.lon;
            data.y = leg.to.lat;
            data.color = "ff0000";
            channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, 'marker_to_'+i]);
            for (var j in leg.intermediateStops) {
                var istop = leg.intermediateStops[j];
                data.x = istop.lon;
                data.y = istop.lat;
                data.color = "0000ff";
                channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, 'marker_stop_'+i+'_'+j]);
            }

        }
    }


}
var getRouteRequest = function(mode){

    // From Pasila to Center point on a map
    channel.getMapPosition(function(data) {
        var datain = {
            "fromlat": "6675341",
            "fromlon": "385414",
            "srs": "EPSG:3067",
            "tolat": data.centerY,
            "tolon": data.centerX,
            "showIntermediateStops" : "true",
            "mode": mode
        };
        channel.postRequest('GetRouteRequest', [datain]);
        channel.log('GetRouteRequest posted with data', datain);
     });
};

var clickHandlers = {
    //====================
    // REQUESTS
    //====================
    'GetRouteRequestTransit' : function() {
        getRouteRequest('TRANSIT,WALK');
    },
    'GetRouteRequestWalk' : function() {
        getRouteRequest('WALK');
    },
    'GetRouteRequestBicycle' : function() {
        getRouteRequest('BICYCLE');
    },
    'ShowInfoBoxRequest': function() {
        channel.getMapPosition(function(data) {
            var content = [
                {
                    'html': '<div>Map position info:</div>'
                },
                {
                    'html': '<div>Center: '+parseInt(data.centerX)+', '+parseInt(data.centerY)+'</div>',
                    'actions': [
                        {
                            name: "My link 1",
                            type: "link",
                            action: {
                                info: "this can include any info",
                                info2: "action-object can have any number of params"
                            }
                        },
                        {
                            name: "My link 2",
                            type: "link",
                            action: {
                                info: "this can include any info",
                                info2: "action-object can have any number of params"
                            }
                        }
                    ]
                },
                {
                    'html': '<div>Zoom level: '+data.zoom+'</div>'
                },
                {
                    'actions': [
                        {
                            name: "My link 3",
                            type: "link",
                            action: {
                                info: "this can include any info",
                                info2: "action-object can have any number of params",
                            }
                        },
                        {
                            name: "My link 4",
                            type: "link",
                            action: {
                                info: "this can include any info",
                                info2: "action-object can have any number of params",
                            }
                        },
                        {
                            name: "My button 1",
                            type: "button",
                            group: 1,
                            action: {
                               info: "this can include any info",
                                info2: "action-object can have any number of params",
                                buttonInfo: "This button has group 1 and is placed to the same row with other actions that have the same group"
                            }
                        },
                        {
                            name: "My button 2",
                            type: "button",
                            group: 1,
                            action: {
                                info: "this can include any info",
                                info2: "action-object can have any number of params",
                                buttonInfo: "This button has group 1 and is placed to the same row with other actions that have the same group"
                            }
                        }
                    ]
                }
            ];
                data = [
                    'myInfoBox',
                    'Generic info box',
                    content,
                    {
                        'lon': data.centerX,
                        'lat': data.centerY
                    },
                    {
                        colourScheme: {
                            bgColour: '#00CCFF',
                            titleColour: '#FFFFFF',
                            headerColour: '#00CCFF',
                            iconCls: 'icon-close-white',
                            buttonBgColour: '#00CCFF',
                            buttonLabelColour: '#FFFFFF',
                            linkColour: '#000000'
                        },
                        font: 'georgia',
                        positioning: 'left'
                    }
                ];

            channel.postRequest('InfoBox.ShowInfoBoxRequest', data);
            channel.log('InfoBox.ShowInfoBoxRequest posted with data', data);
        });
    },
    'HideInfoBox' : function() {
    	var infoboxId = 'myInfoBox';
    	channel.postRequest('InfoBox.HideInfoBoxRequest', [infoboxId]);
    	channel.log('InfoBox.HideInfoBoxRequest posted with data', infoboxId);
    },
    'AddMarkerRequestCenterOfMapForInfobox': function(){
        var MARKER_ID = 'MARKER_WITH_POPUP';
        channel.getMapPosition(function(data) {
            // Add marker to center map
            var markerData = {
                x: data.centerX,
                y: data.centerY,
                color: "ff0000",
                msg : '',
                shape: 1, // icon number (0-6)
                size: 4
            };
            channel.postRequest('MapModulePlugin.AddMarkerRequest', [markerData, MARKER_ID]);
            channel.log('MapModulePlugin.AddMarkerRequest posted with data', markerData);
        });
    },
    'ShowInfoBoxRequestForMarker': function(){
        // Open popup for marker
        var MARKER_ID = 'MARKER_WITH_POPUP';
        var content = [
            {
                'html': '<div>Marker popup</div>'
            }
        ];
        var infoboxData = [
            'markerInfoBox',
            'Marker info box',
            content,
            {
                marker: MARKER_ID
            },
            {
                mobileBreakpoints: {
                    width: 100,
                    height: 100
                },
                hidePrevious: true
            }
        ];

        channel.postRequest('InfoBox.ShowInfoBoxRequest', infoboxData);
        channel.log('InfoBox.ShowInfoBoxRequest posted with data', infoboxData);
    },
    'AddMarkerRequest': function() {
        var data = {
            x: 386020,
            y: 6670057,
            color: 'ff0000',
            msg : '',
            shape: 3,
            size: 3
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
        channel.log('MapModulePlugin.AddMarkerRequest posted with data', [data, MARKER_ID]);
    },
    'AddMarkerRequest2': function() {
        var data = {
            x: 386020,
            y: 6670057,
            msg : '',
            shape: '<svg width="32" height="32"><g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>',
            offsetX: 16,
            offsetY: 16,
            size: 3
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
        channel.log('MapModulePlugin.AddMarkerRequest posted with data', [data, MARKER_ID]);
    },
    'AddMarkerRequest3': function() {
        var data = {
            x: 386020,
            y: 6670057,
            shape: 'http://demo.paikkatietoikkuna.fi/Oskari/resources/framework/bundle/mapmodule-plugin/images/marker.png',
            offsetX: 16,
            offsetY: 0
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
        channel.log('MapModulePlugin.AddMarkerRequest posted with data', [data, MARKER_ID]);
    },
    'RemoveMarkersRequest': function() {
        channel.postRequest('MapModulePlugin.RemoveMarkersRequest', []);
        channel.log('RemoveMarkerRequest posted with data', []);
    },
    // SHOW OR HIDE MARKER
    'ShowHideMarkerAddMarker': function(){
        var data = {
            x: 386020,
            y: 6670057,
            color: "ff0000",
            msg : '',
            shape: 3, // icon number (0-6)
            size: 3
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
        channel.log('MapModulePlugin.AddMarkerRequest posted with data', [data, MARKER_ID]);
    },
    'ShowHideMarkerHideMarker' : function(){
        channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [false, MARKER_ID]);
        channel.log('MapModulePlugin.MarkerVisibilityRequest posted with data', [false, MARKER_ID]);
    },
    'ShowHideMarkerShowMarker' : function(){
        channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [true, MARKER_ID]);
        channel.log('MapModulePlugin.MarkerVisibilityRequest posted with data', [true, MARKER_ID]);
    },
    // \SHOW OR HIDE MARKER
    'GetFeatureInfoRequest': function() {
        channel.getMapPosition(function(data){
            var lonlat = [data.centerX, data.centerY];
            channel.postRequest('MapModulePlugin.GetFeatureInfoRequest', lonlat);
            channel.log('MapModulePlugin.GetFeatureInfoRequest posted with data', lonlat);
        });
    },
    'MapLayerVisibilityRequest': function() {
        channel.getAllLayers(function (layers) {
            var layer = layers[0];
            channel.postRequest(
                    'MapModulePlugin.MapLayerVisibilityRequest',
                    [layer.id, !layer.visible]
            );
            channel.log('MapModulePlugin.MapLayerVisibilityRequest sent with parameters: ', layer.id + ', ' + !layer.visible);
        });
    },
    'MapLayerVisibilityRequestHide': function() {
        var layer_id = 'VECTOR';
        var setVisible = false;
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer_id, setVisible]);
        channel.log('MapLayerVisibilityRequest sent with parameters: ', layer_id, setVisible);
    },
    'MapLayerVisibilityRequestShow': function() {
        var layer_id = 'VECTOR';
        var setVisible = true;
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer_id, setVisible]);
        channel.log('MapLayerVisibilityRequest sent with parameters: ', layer_id, setVisible);
    },
    'MapMoveRequest': function() {
        moveMap(LOCATION_POSIO[0], LOCATION_POSIO[1], 7);
        channel.log('MapModulePlugin.MapMoveRequest posted with data', [LOCATION_POSIO[0], LOCATION_POSIO[1], 7]);
    },
    'rotate.map': function(deg) {
      var rot = jQuery(deg.currentTarget).val();
      rot = (!isNaN(rot)) ? parseFloat(rot) : null;
      if(rot) {
        channel.postRequest('rotate.map',[rot]);
        channel.log('rotate.map posted with data', [rot]);
        } else {
            channel.postRequest('rotate.map',[]);
            channel.log('rotate.map posted with data', []);
        }
    },
    'ChangeMapLayerOpacityRequest': function() {
        channel.getAllLayers(function (layers) {
            var layer_id = layers[0].id;
            var opacity = layers[0].opacity;
            if (opacity !== 100) {
                new_opacity = 100;
            } else {
                new_opacity = 50;
            }
            channel.postRequest('ChangeMapLayerOpacityRequest', [layer_id, new_opacity]);
            channel.log('ChangeMapLayerOpacityRequest sent with parameters: ', layer_id + ', ' + new_opacity);
        });
    },
    'GetUserLocationRequest': function() {
        channel.postRequest('MyLocationPlugin.GetUserLocationRequest', [true]);
        channel.log('MyLocationPlugin.GetUserLocationRequest posted with data', true);
    },
    'ShowProgressSpinnerRequest': function() {
        var isVisible = !states.progressSpinnerVisible;
        channel.postRequest('ShowProgressSpinnerRequest',[isVisible]);
        channel.log('ShowProgressSpinnerRequest posted with data', isVisible);
        states.progressSpinnerVisible = !states.progressSpinnerVisible;
    },
    'SearchRequest': function() {
        var data = document.getElementById("inputSearch").value;

        channel.postRequest('SearchRequest', [data]);
        channel.log('SearchRequest posted with data', data);

    },
    'GetFeedbackServiceRequest': function() {
        channel.postRequest('GetFeedbackServiceRequest', []);
    },
    'GetFeedbackServiceRequestWithId': function() {
        channel.postRequest('GetFeedbackServiceRequest', ["180"]);
    },
    'GetFeedbackRequest': function () {
        channel.getMapBbox(function (data) {
            var filterdata = {
                "start_date": "2016-09-01T00:00:00Z",
                "bbox": data.left + ',' + data.bottom + ',' + data.right + ',' + data.top,
                "status": "open,closed"
            };
            data = {
                "srs": "EPSG:3067",
                "payload": filterdata
            };
            channel.postRequest('GetFeedbackRequest', [data]);
        });

    },
    'PostFeedbackRequest': function() {
        switch(this.getAttribute("geom-type")) {
            case "point":
                channel.getMapPosition(function(pdata){
                    var postdata = {
                        "service_code": "180",
                        "description": "Kampin bussipysäkillä on roskakori täynnä",
                        "first_name" : "Point",
                        "last_name" : "POC",
                        "lat": pdata.centerY,
                        "long": pdata.centerX
                    };
                    var data = {
                        "srs":"EPSG:3067",
                        "payload": postdata
                    };
                    channel.postRequest('PostFeedbackRequest', [data]);
                    channel.log('PostFeedbackRequest posted with data', [data]);
                });
                break;
            case "line":
                var postdata = {
                    "service_code": "180",
                    "description": "Vartiosaari kaipaa suojelua",
                    "first_name" : "Line",
                    "last_name" : "POC",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [ [393000,6673192],[393216,6673560],[393712,6673864],[393736,6673592]]}
                };
                var data = {
                    "srs":"EPSG:3067",
                    "payload": postdata
                };
                channel.postRequest('PostFeedbackRequest', [data]);
                channel.log('PostFeedbackRequest posted with data', [data]);
                break;
            case "polygon":
                postdata = {
                    "service_code": "180",
                    "description": "Savua ilmassa",
                    "first_name" : "Polygon",
                    "last_name" : "POC",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[382472.5,6677324.5],[382328.5,6676636.5],[383288.5,6676332.5],[383528.5,6677100.5],[382472.5,6677324.5]]]}
                };
                data = {
                    "srs":"EPSG:3067",
                    "payload": postdata
                };
                channel.postRequest('PostFeedbackRequest', [data]);
                channel.log('PostFeedbackRequest posted with data', [data]);
                break;
            default:

        }

    },
    'StartDrawingRequest': function() {
        var data = ['my functionality id', 'Polygon'];
        channel.postRequest('DrawTools.StartDrawingRequest', data);
        channel.log('DrawTools.StartDrawingRequest posted with data:', data);
    },
    'StopDrawingRequest': function() {
        var data = ['my functionality id'];
        channel.postRequest('DrawTools.StopDrawingRequest', data);
        channel.log('DrawTools.StopDrawingRequest posted with data:', data);
    },
    'StopDrawingRequestClear': function() {
        var data = ['my functionality id', true];
        channel.postRequest('DrawTools.StopDrawingRequest', data);
        channel.log('DrawTools.StopDrawingRequest posted with data:', data);
    },
    'AddFeaturesToMapRequest': function() {
            var x = 488704;
            var y = 6939136;
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
                        'coordinates': [[x, y], [x+100000, y+100000]]
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

            var testOptions = {
                'minResolution': 0,
                'maxResolution': 1000
            };
            var params = [geojsonObject, {
                    clearPrevious: true,
                    layerOptions: testOptions,
                    centerTo: true,
                    cursor: 'zoom-in',
                    prio: 4,
                    minScale: 1451336
                }];

            channel.postRequest(
                'MapModulePlugin.AddFeaturesToMapRequest',
                params
            );
            channel.log('MapModulePlugin.AddFeaturesToMapRequest posted with data', params);

            var geojsonObject2 = {
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
                        'coordinates': [[x+30000, y], [x+130000, y+100000]]
                      },
                      'properties': {
                        'test_property': 'Line'
                      }
                    },
                    {
                      'type': 'Feature',
                      'geometry': {
                        'type': 'Point',
                        'coordinates': [x+30000, y]
                      },
                      'properties': {
                        'test_property': null
                      }
                    }

                  ]
                };

            var testOptions2 = {
                'minResolution': 0,
                'maxResolution': 1000
            };
            var params2 = [geojsonObject2, {
                    clearPrevious: false,
                    layerOptions: testOptions2,
                    centerTo: true,
                    featureStyle: {
                        fill: {
                            color: '#ff0000'
                        },
                        stroke : {
                            color: '#ff0000',
                            width: 5
                        },
                        text : {
                            scale : 1.3,
                            fill : {
                                color : 'rgba(0,0,0,1)'
                            },
                            stroke : {
                                color : 'rgba(255,255,255,1)',
                                width : 2
                            },
                            labelProperty: 'test_property'
                        }
                    },
                    cursor: 'zoom-out',
                    prio: 1
                }];


            channel.postRequest(
                'MapModulePlugin.AddFeaturesToMapRequest',
                params2
            );
            channel.log('MapModulePlugin.AddFeaturesToMapRequest posted with data', params2);
    },
    'AddFeaturesToMapRequestUsingSVG': function() {
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
    		          'type': 'Point',
    		          'coordinates': [488704, 6939136]
    		        },
    		        'properties': {
    		          'label': 'I am a point feature!'
    		        }
    		      }
    		    ]
    		};
    		var params = [geojsonObject, {
    		      clearPrevious: false,
    		      centerTo: true,
    		      cursor: 'zoom-in',
    		      featureStyle: {
    		          image : {
    		              shape: 2,
    		              size: 1,
    		              color: '#ff3300',
    		              stroke: '#000000'
    		          },
    		          text : {
    		              scale : 1.3,
    		              fill : {
    		                  color : 'rgba(0,0,0,1)'
    		              },
    		              stroke : {
    		                  color : 'rgba(255,255,255,1)',
    		                  width : 2
    		              },
                      labelProperty: 'label',
    		              offsetX: 65,
    		              offsetY: 8
    		          }
    		      }
    		}];
    		channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', params);
            channel.log('MapModulePlugin.AddFeaturesToMapRequest posted with data', params);
    },
    'RemoveFeaturesFromMapRequest': function() {
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest',[]);
        channel.log('MapModulePlugin.RemoveFeaturesFromMapRequest posted without params');
    },
    'RemoveFeaturesFromMapRequest2': function() {
    	var params = ['test_property', 1, 'VECTOR'];
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', params);
        channel.log('MapModulePlugin.RemoveFeaturesFromMapRequest posted with params', params);
    },
    'UpdateFeature_AddWKTFeature': function(){
        // First add feature, feature format can be an WKT or GeoJSON
        // Define a wkt-geometry
        var WKT = 'POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322, 382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))';

        // Some attributes for the feature
        var attributes = {
          test_property: 1
        };

        // Styling
        var featureStyle = {
          fill: {
            color: 'rgba(0,0,0,0.3)',
          },
          stroke: {
            color: '#FF0000',
            width: 10
          },
          text : {
            scale : 1.3,
            fill : {
              color : 'rgba(0,0,0,1)'
            },
            stroke : {
              color : 'rgba(255,255,255,1)',
              width : 2
            },
            labelProperty: 'test_property'
          }
        };

        // Add features
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [WKT, {
            layerId: 'MY_VECTOR_LAYER',
            clearPrevious: true,
            layerOptions: null,
            centerTo: false,
            featureStyle: featureStyle,
            attributes: attributes
        }]);
    },
    'UpdateFeature_UpdateWKTFeature': function(){
        // Now update previously added feature
        // For example change stroke style
        var featureStyle = {
          stroke: {
            color: '#00FF00',
            width: 5
          }
        };

        // Define wanted feature attributes
        var updatedFeatureAttributes = {'test_property':1};
        var params = [updatedFeatureAttributes, {
            featureStyle: featureStyle,
            layerId: 'MY_VECTOR_LAYER'
        }];

        channel.postRequest(
            'MapModulePlugin.AddFeaturesToMapRequest',
            params
        );
    },
    'ZoomToFeaturesRequest': function() {
        channel.postRequest('MapModulePlugin.ZoomToFeaturesRequest',[]);
        channel.log('MapModulePlugin.ZoomToFeaturesRequest posted without params');
    },
    'ZoomToFeaturesRequest2': function() {
        channel.postRequest('MapModulePlugin.ZoomToFeaturesRequest',[{layer: ['testLayer']}, {'species': ['parcel']}]);
        channel.log('MapModulePlugin.ZoomToFeaturesRequest');
    },
    'AddFeaturesToMapRequestForZooming': function() {
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
                     'type': 'Polygon',
                     'coordinates': [[[323424,6828464],[324192,6825872],[323744,6822384],[323424,6828464]]]
                   },
                   'properties': {
                       'test_property': '123-456-7777-8888',
                       'species': 'parcel'
                   }
                 },
                 {
                     'type': 'Feature',
                     'geometry': {
                       'type': 'Polygon',
                       'coordinates': [[[309856,6829840],[312576,6833808],[315424,6831120],[315040,6828592],[311328,6827472],[309856,6829840]]]
                     }
                 }
               ]
        };
        var params = [geojsonObject, {
                layerId: 'testLayer',
                clearPrevious: false,
                centerTo: true,
                featureStyle: {
                    fill: {
                        color: 'rgba(255,0,255,0.2)'
                    },
                    stroke : {
                        color: '#ff0000',
                        width: 3
                    },
                    text : {
                        scale : 1.3,
                        fill : {
                            color : 'rgba(0,0,0,1)'
                        },
                        stroke : {
                            color : 'rgba(255,255,255,1)',
                            width : 2
                        },
                        labelProperty: 'test_property'
                    }
                },
                cursor: 'zoom-out',
                prio: 1
        }];

        channel.postRequest(
            'MapModulePlugin.AddFeaturesToMapRequest',
            params
        );
        channel.log('MapModulePlugin.AddFeaturesToMapRequest posted with data', params);
    },
    'MapLayerUpdateRequest': function() {
        var layerId = 1387;
        var params = {
            SLD_BODY:
                '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">'+
                '    <NamedLayer>'+
                '    <Name>oskari:kunnat2013</Name>'+
                '    <UserStyle>'+
                '    <Title>SLD Cook Book: Simple polygon</Title>'+
                '    <FeatureTypeStyle>'+
                '    <Rule>'+
                '    <PolygonSymbolizer>'+
                '    <Fill>'+
                '    <CssParameter name="fill">#000080</CssParameter>'+
                '    <CssParameter name="fill-opacity">0.5</CssParameter>'+
                '    </Fill>'+
                '    </PolygonSymbolizer>'+
                '    </Rule>'+
                '    </FeatureTypeStyle>'+
                '    </UserStyle>'+
                '    </NamedLayer>'+
                '    </StyledLayerDescriptor>'
        };

        channel.postRequest('MapModulePlugin.MapLayerUpdateRequest', [layerId, true, params]);
        channel.log('MapModulePlugin.MapLayerUpdateRequest', params);
    },
    'MapLayerUpdateRequestReset': function() {
        var layerId = 1387;
        var params = {
            SLD_BODY: null
        };

        channel.postRequest('MapModulePlugin.MapLayerUpdateRequest', [layerId, true, params]);
        channel.log('MapModulePlugin.MapLayerUpdateRequest', params);
    },

    //====================
    // FUNCTIONS
    //====================
    'GetAllLayers': function() {
        channel.getAllLayers(function(data){
            channel.log('GetAllLayers: ', data);
        });
    },
    'GetMapPosition': function() {
        channel.getMapPosition(function(data){
            channel.log('GetMapPosition: ', data);
        });
    },
    'GetMapBbox': function() {
        channel.getMapBbox(function(data){
            channel.log('GetMapBbox: ', data);
        });
    },
    'GetSupportedEvents': function() {
        channel.getSupportedEvents(function(data){
            channel.log('GetSupportedEvents: ', data);
        });
    },
    'GetSupportedFunctions': function() {
        channel.getSupportedFunctions(function(data){
            channel.log('GetSupportedFunctions: ', data);
        });
    },
    'GetSupportedRequests': function() {
        channel.getSupportedRequests(function(data){
            channel.log('GetSupportedRequests: ', data);
        });

    },
    'GetZoomRange': function() {
        channel.getZoomRange(function(data){
            channel.log('GetZoomRange: ', data);
        });
    },
    'zoomIn': function() {
        channel.zoomIn(function(data){
            channel.log('Zoom level after: ', data);
        });
    },
    'zoomOut': function() {
        channel.zoomOut(function(data){
            channel.log('Zoom level after: ', data);
        });
    },
    'zoomTo': function() {
        channel.zoomTo([5], function(data){
            channel.log('Zoom level after: ', data);
        });
    },
    'GetPixelMeasuresInScale': function () {
        // A4 example ( size in mm units and portrait orientation
        var scale = document.getElementById("inputPlotScale").value;
        if(scale && Number(scale) < 1){
            jQuery('#publishedMap').parent().find('#id_plot_bbox').remove();
            channel.log('GetPixelMeasuresInScale: ', ' old plot area removed, if any exists');
            savedPlotAreaData = null;
            return;
        }
        if(!scale || scale === ''){
            channel.getPixelMeasuresInScale([[210, 297]], function (data) {
                savedPlotAreaData = [[210, 297], data.scale];
            });
        }
        else {
            savedPlotAreaData = [[210, 297], scale];
        }

        plotPlotArea([[210, 297], scale]);

    },
    /*TODO: combine state handling into one functionality with three buttons... */
    'saveState': function() {
        channel.getCurrentState(function(data){
            savedState = data;
            //$('#btnLoadState').attr("disabled", false);
            channel.log('GetCurrentState: ', data);
        });

    },
    'resetState': function() {
        channel.resetState(function(){
            // no need to do this, just for demo purpose
            //$('#btnLoadState').attr("disabled", true);
            channel.log('State Reset');
        });

    },
    'loadState': function() {
        channel.useState([savedState], function(){
            channel.log('UseState: ', savedState);
        });
    },
    'getFeatures': function() {
        channel.getFeatures([true], function(data){
            channel.log('GetFeatures: ', data);
        });
    },
    'getScreenshot': function() {
        channel.getScreenshot(function(data) {
            var success = data && data.length;
            var msg = 'GetScreenshot '+(success ? 'success ' : 'failed');
            channel.log(msg);
            document.getElementById('getScreenshotImgTag').src = data;
        });
    },
    'sendUIEvent': function() {
    	channel.sendUIEvent(['coordinatetool'], function(data) {
    	    channel.log('sendUIEvent: ', data);
    	});
    },
    'toggleCrosshair': function() {
        channel.sendUIEvent(['mapmodule.crosshair'], function(data) {
            channel.log('sendUIEvent mapmodule.crosshair: ', data);
        });
    },
    'setCursorStyle': function() {
        var cursorStyle = jQuery('#setCursorStyleSelect').val();
        channel.setCursorStyle([cursorStyle], function(data) {
            channel.log('setCursorStyle: ', data);
        });
    }
};

var savedState = null;
var savedPlotAreaData = null;
var savedZoom = null;


// Referenced HTML-elements
var elements = {
    iframe: $("#publishedMap")[0],
    coordinateField: $("#coordinates")[0],

    issueRoad: $("#issueType1"),
    issueEnv: $("#issueType2"),

    reportForm: $("#mode1Form"),
    commentForm: $("#mode2Form"),
    addBtn : $("#btnAddNew"),
    cancelBtn :$("#btnAddCancel"),
    reportBtn : $("#btnReportNew"),
    markerList : $("#mode2Form").find('ul.markers')
};

var states = {
    progressSpinnerVisible: false
  };


var rpcEvents = [
    'map.rotated',
    'AfterAddMarkerEvent',
    'MarkerClickEvent',
    'RouteResultEvent',
    'FeedbackResultEvent',
    'MapClickedEvent',
    'AfterMapMoveEvent',
    'UserLocationEvent',
    'SearchResultEvent',
    'FeatureEvent',
    'DrawingEvent',
    'InfoboxActionEvent',
    'InfoBox.InfoBoxEvent'
  ];
var eventHandlers = {
    'SearchResultEvent' : function(data) {
        if(data.success && data.result.totalCount > 0){
            var search1 = data.result.locations[0],
                zoom = {};
            zoom.scale = search1.zoomScale;
            moveMap(search1.lon, search1.lat, zoom);
            // add a marker to 1st search item
            var marker = Util.getMarkerTemplate();
            marker.x = search1.lon;
            marker.y = search1.lat;
            marker.msg = search1.name +'_' + search1.type + '_' + search1.village;
            addMarker(marker, USER_MARKER_ID);
            if(data.result.totalCount === 1) {
                displayMessage('Zoomed to ' + search1.name, 5);
            } else if(data.result.totalCount > 1) {
                var items = '';
                data.result.locations.forEach(
                    function addItem(s) { items = items + s.name + ' / ' + s.type + ' / ' + s.village +'\n'; }
                  );

                 displayMessage('Zoomed to 1st one -  \n ' + items ,5);
            }
        } else if(data.success && data.result.totalCount === 0){
            displayMessage('No items found - search key: ' + data.requestParameters.searchKey, 5);
        } else{
            displayMessage('Search error: ' + data.result.responseText, 5);
        }
    },
    'MapClickedEvent': function(data) {
        // add a marker to clicked spot -
        var marker = Util.getMarkerTemplate();
        marker.x = data.lon;
        marker.y = data.lat;
      //  addMarker(marker, USER_MARKER_ID); -> Use Marker requests
    },
    'AfterMapMoveEvent': function(data) {
        // Replot Plot area if zoom is changed
        if(savedZoom && savedZoom != data.zoom && savedPlotAreaData){
            savedZoom = data.zoom;
            plotPlotArea(savedPlotAreaData);
        }
        else if (!savedZoom && savedPlotAreaData)
        {
            savedZoom = data.zoom;
            plotPlotArea(savedPlotAreaData);
        }
    },
    'RouteResultEvent': function(data) {
        if(!data || !data.success) {
            displayMessage('Getting routes failed ! - zoom map center around 1 km to nearest public trafic stop', 5);
        } else {
            var geoJSON = data && data.plan && data.plan.itineraries && data.plan.itineraries.length ? data.plan.itineraries[0].geoJSON : undefined;
            //Plot routes
            if (geoJSON) {
                channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                    geoJSON, {
                        clearPrevious: true,
                        centerTo: true,
                        cursor: 'zoom-in',
                        prio: 4,
                        featureStyle: {
                            fill: {
                                color: '#ff0000'
                            },
                            stroke : {
                                color: '#ff0000',
                                width: 5
                            },
                            text : {
                                scale : 1.3,
                                fill : {
                                    color : 'rgba(0,0,0,1)'
                                },
                                stroke : {
                                    color : 'rgba(255,255,255,1)',
                                    width : 2
                                }
                            }
                        },
                        optionalStyles: [{
                            property: {
                                value: 'AIRPLANE',
                                key: 'mode'
                            },
                            stroke: {
                                color: '#0d92ff',
                                width: 10
                            }
                        }, {
                            property: {
                                value: 'BUS',
                                key: 'mode'
                            },
                            stroke: {
                                color: '#0d92ff',
                                width: 10
                            }
                        }, {

                            property: {
                                value: 'RAIL',
                                key: 'mode'
                            },
                            stroke: {
                                color: '#0d92ff',
                                width: 10
                            }
                        }, {
                            property: {
                                value: 'FERRY',
                                key: 'mode'
                            },
                            stroke: {
                                color: '#0d92ff',
                                width: 10,
                                lineDash: [10,20]
                            }
                        }, {
                            property: {
                                value: 'TRAM',
                                key: 'mode'
                            },
                            stroke: {
                                color: '#0d92ff',
                                width: 10
                            }
                        }, {
                            property: {
                                value: 'SUBWAY',
                                key: 'mode'
                            },
                            stroke: {
                                color: '#0d92ff',
                                width: 10
                            }
                        }, {
                            property: {
                                value: 'WALK',
                                key: 'mode'
                            },
                            stroke: {
                                color: '#0d92ff',
                                width: 10,
                                lineDash: [0, 10]
                            }
                        }, {
                            property: {
                                value: 'BICYCLE',
                                key: 'mode'
                            },
                            stroke: {
                                color: '#0d92ff',
                                width: 10,
                                lineDash: [10, 20]
                            }

                        }]
                    }
                ]);


                // Get route mode changed start points
                var legs = data.plan.itineraries[0].legs;
                var features = [];
                for (var i=0;i<legs.length;i++) {
                    // Draw start points
                    var leg = legs[i];
                    var feature = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [leg.from.lon, leg.from.lat]
                        },
                        "properties": {
                            "mode": leg.mode
                        }
                    };
                    features.push(feature);

                    // Calculate stops
                    for (var j in leg.intermediateStops) {

                        var istop = leg.intermediateStops[j];

                        feature = {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [istop.lon, istop.lat]
                            },
                            "properties": {
                                "mode": "stop_" + leg.mode
                            }
                        };
                        features.push(feature);
                    }

                }

                // Get end point
                var endPoint = legs[legs.length-1];
                var endPointFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [endPoint.to.lon, endPoint.to.lat]
                    },
                    "properties": {
                        "mode": 'routeEndPoint'
                    }
                };
                features.push(endPointFeature);


                geoJSON = {
                    'type': 'FeatureCollection',
                    'crs': {
                        'type': 'name',
                        'properties': {
                            'name': 'EPSG:3067'
                        }
                    },
                    'features': features
                };


                if(geoJSON) {
                    channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                        geoJSON, {
                            clearPrevious: false,
                            centerTo: false,
                            cursor: 'pointer',
                            prio: 1,
                            optionalStyles: [
                            {
                                property: {
                                    value: 'FERRY',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'marker_ferry'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'AIRPLANE',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'marker_flight'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'WALK',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'marker_walk'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'BUS',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'marker_bus'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'RAIL',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'marker_train'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'SUBWAY',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'marker_metro'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'BICYCLE',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'marker_bike'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'routeEndPoint',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'marker_flag'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'stop_RAIL',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'train_stop'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'stop_BUS',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'bus_stop'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'stop_SUBWAY',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'metro_stop'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'stop_FERRY',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'ferry_stop'
                                    },
                                    size: 5
                                }
                            },
                            {
                                property: {
                                    value: 'stop_AIRPLANE',
                                    key: 'mode'
                                },
                                image: {
                                    shape: {
                                        key: 'routing',
                                        name: 'fligth_stop'
                                    },
                                    size: 5
                                }
                            }


                            ]
                        }
                    ]);
                }
            }
        }
    },
    'FeedbackResultEvent': function(data) {
        if (!data || !data.success) {
            displayMessage('Getting feedback response failed ! ', 5);
        } else {
            displayMessage('Getting feedback response success ! ', 5);
            var geoJSON = data && data.data && data.data.getFeedback ? data.data.getFeedback : undefined;
            //Plot routes
            if (geoJSON) {
                channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                    geoJSON, {
                        clearPrevious: true,
                        centerTo: true,
                        cursor: 'zoom-in',
                        prio: 4,
                        featureStyle: {
                            fill: {
                                color: '#ff0000'
                            },
                            stroke: {
                                color: '#ff0000',
                                width: 5
                            },
                            text: {
                                scale: 1.3,
                                fill: {
                                    color: 'rgba(0,0,0,1)'
                                },
                                stroke: {
                                    color: 'rgba(255,255,255,1)',
                                    width: 2
                                }
                            }
                        }
                    }
                ]);
            }
        }
    }
};


// RPC TEST EVENTS
jQuery(document).ready(function(){
    jQuery(rpcEvents).each(function(index, eventName){
        if(eventName) {
            channel.handleEvent(eventName, function(data){
                channel.log(eventName, data);
                isMarkerOff = false;
                if(eventHandlers[eventName]) {
                    eventHandlers[eventName](data);
                }
            });
        }
    });
});



// init connection
var channel = OskariRPC.connect(
    elements.iframe,
    IFRAME_DOMAIN
);

var logDiv = jQuery('#debuglog');
if(logDiv.length) {
    var logMsgTemplate = jQuery('<div class="logmsg"></div>');
    channel.log = function() {
        if(!arguments.length) {
            return;
        }
        var now = new Date();
        var msg = logMsgTemplate.clone();
        msg.append(now.toLocaleTimeString() + ': ');
        _.each(arguments, function(arg) {
            if(typeof arg === 'function') {
                return;
            }
            else if(typeof arg === 'object') {
                var json = JSON.stringify(arg, null, '  ');
                json = json.replace(/\\"/g, '"');
                msg.append('<xmp>' + json + '</xmp>');
            }
            else {
                msg.append(arg + ' ');
            }
        });

        logDiv.prepend(msg);
    };
}

channel.enableDebug(true);
channel.onReady(function() {
    channel.log('Map is now listening');
    checkMapRotation();

    var expectedOskariVersion = '1.36.0';
    channel.isSupported(expectedOskariVersion, function(blnSupported) {
        if(blnSupported) {
            channel.log('Client is supported and Oskari version is ' + expectedOskariVersion);
        } else {
            channel.log('Oskari-instance is not the one we expect (' + expectedOskariVersion + ') or client not supported');
            // getInfo can be used to get the current Oskari version
            channel.getInfo(function(oskariInfo) {
                channel.log('Current Oskari-instance reports version as: ', oskariInfo);
            });
        }
    });
    channel.isSupported(function(blnSupported) {
        if(!blnSupported) {
            channel.log('Oskari reported client version is not supported: ' + OskariRPC.VERSION  +
            '. The client might work, but some features are not backward compatible.');
        } else {
            channel.log('Client is supported by Oskari.');
        }
    });
});

$('#actionSelector').on('change', function(event) {
    var value = $(this).val(),f,
        container = $('#documentationContainer');
    $(logDiv).empty();
    $(container).html('');

    if (value && value.length) {

        container.html($('#'+value).html());
        //container.prepend('<h3>'+this.options[this.selectedIndex].text+'</h3>');
        container.prepend(getNextAndPreviousLinks());
        container.find('.navigationLink').on('click', navigate);
        if (clickHandlers[value]) {
            $(container).find('button').on('click', clickHandlers[value]);
        } else {
            //multiple buttons in one example -> state handling. Use data-example as key
            var buttons = $(container).find('button');
            _.each(buttons, function(button) {
                if (clickHandlers[$(button).data('example')]) {
                    $(button).on('click', clickHandlers[$(button).data('example')]);
                }
            });
        }
    }
});
function getNextAndPreviousLinks() {
    var select = $('#actionSelector')[0],
        previousIndex = select.selectedIndex > 0 ? select.selectedIndex - 1 : null,
        showPrev = select.selectedIndex > 0 ? true : false,
        nextIndex = select.selectedIndex < select.options.length - 1 ? select.selectedIndex + 1 : null,
        previousLink = showPrev ?  '<a class="navigationLink" id="'+select.options[previousIndex].value+'">'+
                                            'Previous: '+$(select.options[previousIndex]).html()+
                                        '</a>' : '&nbsp;',
        nextLink = nextIndex ?  '<a class="navigationLink" id="'+select.options[nextIndex].value+'">'+
                                    'Next: '+$(select.options[nextIndex]).html()+
                                '</a>' : '&nbsp;';

    var retVal =    '<div class="navigationLinkParent">'+
                        '<div class="navigationLinkBlock left">'+
                            previousLink+
                        '</div>'+
                        '<div class="navigationLinkBlock right">'+
                            nextLink+
                        '</div>'+
                    '</div>';

    return retVal;
}
function navigate(event) {
    $('#actionSelector').val($(this).attr('id'));
    $('#actionSelector').change();


}
$('#actionSelector').change();
