# Oskari 2.0 Migration Guide

Oskari 2.0 includes RequireJS as an module loader. The previous loader is also available with 'require("oskari-with-loader", function (Oskari) {}).
oskari-with-loader is capable of loading previous oskari bundles.

## Introducing Modules

Modules have replaced previous oskari bundles. A module is a software component with all resources contained within. Modules can depend on other modules and communicates using the oskari platform.

## Oskari Platform

The platform provides communication possibilities to modules in a similar manner as previous old bundles were provided communication possibilities by the core and sandbox. The platform consist of the previous core, sandbox and common utilities.

## Getting started using Oskari 2.0

Oskari utilizes RequireJS as file and module loader. We'll start by requiring Oskari, so that we can load mapfull, mapmodule-plugin, and divmanazer. These are the most depended on modules.

All modules will be automatically initialized. Start mapfull, and divmanazer.

Require the selected modules to be used and start.

## Bundle migration to Module

Previous bundle.js files can be converted to some extent automatically using the grunt bundle2module task.

	grunt bundle2module:../path/to/bundle.js:../path/to/resulting/module.js

The bundle2module task is configured to utilize the same RequireJS configurations as in the sample file. Paths are relative in general so that the RequireJS optimizer is able to find the files as well as load the files in the browser.

## Common pitfalls

* The build cannot find the required module. Use require config to specify the path.
* The browser is unable to load the module. Check the file extension is correct. Paths starting with / (slash) needs file extension, but paths staring with . (dot) are search for by adding the .js extension automatically.
* The css files are not loaded. Ensure css! plugin is in use for example: "css!/css/style.css"
* Sometimes bundles break. That is likely due to requiring the module twice.

## RequireJS briefly

Require is a module loading library that makes dependency management easier. Each module requires the dependencies they use, which means no globals are needed as the dependencies are passed into the module instead.

The index-dev.html file loads require and bootstraps the main-dev.js file. The main-dev.js file loads the require configuration from mainConfig and loads Oskari. Proceding with loading the appSetup from the server or file, depending on if there is an ajaxUrl to get the appSetup from. The appSetup configuration is used and Oskari is ready to be used.

It turned out that paths relative to the requirejs/lib folder was difficult to master. Therefore the baseUrl is now the Oskari folder. The paths are much clearer and easier to figure out. Most difficulties with builds are incorrect paths, which are intuitive as the root is the Oskari folder.

## Samples

### Sample index-dev.html for development
	<!DOCTYPE html>
	<html>
	    <head>
	        <meta charset="utf-8" />
	        <title>require oskari</title>
	        <link type="text/css" rel="stylesheet"
	        href="http://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700,700italic,800,800italic,600italic,600">
	        <link rel="stylesheet" type="text/css"
	        href="http://demo.paikkatietoikkuna.fi/mml-2.0-theme/css/base.css" />
	        <link rel="stylesheet" type="text/css" href="/Oskari/applications/oskari2/full-map_guest/css/icons.css" />
	        <link rel="stylesheet" type="text/css" href="/Oskari/applications/oskari2/full-map_guest/css/forms.css" />
	        <link rel="stylesheet" type="text/css" href="/Oskari/applications/oskari2/full-map_guest/css/portal.css" />
	        <link rel="stylesheet" type="text/css" href="/Oskari/applications/oskari2/full-map_guest/css/overwritten.css" />
	        <link rel="stylesheet" type="text/css" href="/Oskari/applications/oskari2/full-map_guest/style.css" />
	        <!-- jQuery is needed globally -->
	        <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	        <script src="http://code.jquery.com/jquery-migrate-1.1.1.js"></script>
	    </head>
	    <body>
	        <nav id="maptools">
	            <div id="loginbar"></div>
	            <div id="menubar"></div>
	            <div id="divider"></div>
	            <div id="toolbar"></div>
	        </nav>
	        <div id="contentMap" class="oskariui container-fluid">
	            <div id="menutoolbar" class="container-fluid"></div>
	            <div class="row-fluid" style="height: 100%;">
	                <div class="oskariui-left"></div>
	                <div class="span12 oskariui-center" style="height: 100%; margin: 0;">
	                    <div id="mapdiv"><div class="mapplugins left"></div></div>
	                </div>
	                <div class="oskari-closed oskariui-right">
	                    <div id="mapdivB"></div>
	                </div>
	            </div>
	        </div>
	        <!--  OSKARI -->
	        <script type="text/javascript">
	            var language = "fi";
	        </script>
	        <script type="text/javascript" data-main="main-dev.js" src="../../../libraries/requirejs/require.js"></script>
	    </body>
	</html>

### Sample mainConfig.js
	require.config({
    baseUrl : "/Oskari/", // the base is set to requirejs lib to help requiring 3rd party libs
    paths : { // some path shortcuts to ease declarations
        oskari: "bundles/oskari/oskari",
        "oskari-with-loader": "bundles/oskari/oskari-with-loader",
        jquery: "http://code.jquery.com/jquery-1.9.1",
        "jquery-migrate": "libraries/jquery/jquery-migrate-1.2.1-modified",
        css: "libraries/requirejs/lib/css",
        json: "libraries/requirejs/lib/json",
        domReady: "libraries/requirejs/lib/domReady",
        text: "libraries/requirejs/lib/text",
        normalize: "libraries/requirejs/lib/normalize"
    },
    map: {
      // '*' means all modules will get 'jquery-private'
      // for their 'jquery' dependency.
      '*': { 'jquery': 'jquery-migrate' },
      // 'jquery-private' wants the real jQuery module
      // though. If this line was not here, there would
      // be an unresolvable cyclic dependency.
      'jquery-migrate': { 'jquery': 'jquery' }
    },
    shim: {
      'oskari' : {
        exports: 'Oskari'
      }
    },
    config : {
        i18n : {
            locale : language
        }
    }
	});

### Sample main-dev.js
	require(["mainConfig"], function() {
    /* loading base requirements */
    require(["jquery", "oskari","domReady"],
    /**
     * ... now we have jQuery and Oskari
     */
    function($, Oskari) {
        function getURLParameter(name) {
            var re = name + '=' + '([^&]*)(&|$)';
            var value = RegExp(re).exec(location.search);
            if (value && value.length && value.length > 1) {
                value = value[1];
            }
            if (value) {
                return decodeURI(value);
            }
            return null;
        }
        function gfiParamHandler(sandbox) {
            if (getURLParameter('showGetFeatureInfo') != 'true') {
                return;
            }
            var lon = sandbox.getMap().getX();
            var lat = sandbox.getMap().getY();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var px = mapModule.getMap().getViewPortPxFromLonLat({
                lon: lon,
                lat: lat
            });
            sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px.x, px.y]);
        }
        var config = "json!_applications_/oskari2/full-map_guest/minifierAppSetup.json";
        if (window.ajaxUrl) {
            // populate url with possible control parameters
            var getAppSetupParams = "";
            if(typeof window.controlParams == 'object') {
                for(var key in controlParams) {
                    getAppSetupParams += "&" + key + "=" + controlParams[key];
                }
            }
            config = "json!/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&&action_route=GetAppSetup" + getAppSetupParams;
        }
        /* loading configuration */
        require([config, 
            "_bundles_/oskari/bundle/map-openlayers/module"], function(appSetup) {
            Oskari.setLang(language);
            var appConfig = appSetup.configuration;
            console.log('config', appConfig);
            appConfig.promote = {
                    "conf": {
                        "__name": "Promote",
                        "title": {
                            "fi": "Otsikko tileen",
                            "en": "Title for Tile"
                        },
                        "desc": {
                            "fi": "Voit käyttää julkaisutoimintoa kirjauduttuasi palveluun.",
                            "en": "You need to log in before using the embedding function."
                        },
                        "signup": {
                            "fi": "Kirjaudu sisään",
                            "en": "Log in"
                        },
                        "signupUrl": {
                            "fi": "/web/fi/login",
                            "en": "/web/en/login"
                        },
                        "register": {
                            "fi": "Rekisteröidy",
                            "en": "Register"
                        },
                        "registerUrl": {
                            "fi": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
                            "en": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
                        },
                        "test_toolbarButtons": {
                            "buttonGrp": {
                                "buttonId": {
                                    "iconCls": "tool-reset",
                                    "tooltip": {
                                        "fi": "jee",
                                        "en": "jee en"
                                    }
                                }
                            }
                        }
                    }
                };
            Oskari.setConfiguration(appConfig);
            /* loading main map and divmanazer */
            require(["_bundles_/framework/bundle/mapfull/module",
                "_bundles_/framework/bundle/mapmodule-plugin/module",
                "_bundles_/framework/bundle/divmanazer/module"], function(mapfull, mapmodule, divmanazer) {
                console.log('starting mapfull');
                /* starting to show user that something or another is happening */
                mapfull.start();
                console.log('starting divmanazer');
                divmanazer.start();
                console.log('mapfull and divmanazer started', appConfig);
                var bundles = [];
                for (bundle in appConfig) {
                    if ((bundle === "mapfull") || (bundle === "divmanazer") || (bundle === "openlayers-default-theme")) {
                        // already loaded
                    } else if (bundle === "statsgrid") {
                        bundles.push("_bundles_/statistics/bundle/" + bundle + "/module");
                    } else if (bundle === "metadataflyout") {
                        bundles.push("_bundles_/catalogue/bundle/" + bundle + "/module");
                    } else {
                        bundles.push("_bundles_/framework/bundle/" + bundle + "/module");
                    }
                }
                console.log('bundles', bundles);
                require(bundles, function () {
	/*                require([
                    "_bundles_/framework/bundle/backendstatus/module",
                    "_bundles_/framework/bundle/guidedtour/module",
                    "_bundles_/framework/bundle/toolbar/module",
                    "_bundles_/framework/bundle/layerselection2/module",
                    "_bundles_/framework/bundle/userguide/module",
                    "_bundles_/framework/bundle/layerselector2/module",
                    "_bundles_/framework/bundle/personaldata/module",
                    "_bundles_/framework/bundle/publisher/module",
                    "_bundles_/framework/bundle/printout/module",
                    "_bundles_/framework/bundle/search/module",
                    "_bundles_/framework/bundle/maplegend/module",
                    "_bundles_/framework/bundle/featuredata/module",
                    "_bundles_/framework/bundle/divmanazer/module",
                    "_bundles_/framework/bundle/statehandler/module",
                    "_bundles_/framework/bundle/infobox/module",
                    "_bundles_/framework/bundle/coordinatedisplay/module",
                    "_bundles_/framework/bundle/promote/module"], function () {*/
                        for(var i = 0, ilen = arguments.length; i < ilen; i++) {
                            arguments[i].start();
                        }
                        console.log('Calling GFI Param Handler');
                        var sb = Oskari.getSandbox();
                        gfiParamHandler(sb);
                    }
                );
            });
        });
    });
	});

### Sample minifierAppSetup.json
	{
    "startupSequence": [
        {
            "instanceProps": {},
            "title": "OpenLayers",
            "bundleinstancename": "openlayers-default-theme",
            "fi": "OpenLayers",
            "sv": "?",
            "en": "OpenLayers",
            "bundlename": "openlayers-default-theme",
            "metadata": {
                "Import-Bundle": {
                    "openlayers-default-theme": {
                        "bundlePath": "/Oskari/packages/openlayers/bundle/"
                    },
                    "openlayers-full-map": {
                        "bundlePath": "/Oskari/packages/openlayers/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Map",
            "bundleinstancename": "mapfull",
            "fi": "Map",
            "sv": "?",
            "en": "Map",
            "bundlename": "mapfull",
            "metadata": {
                "Import-Bundle": {
                    "mapwmts": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "mapwfs": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "mapstats": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "service-base": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "event-map-layer": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "request-map-layer": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "mapmodule-plugin": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "event-base": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "mapfull": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "core-base": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "oskariui": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "request-base": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "domain": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "core-map": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "request-map": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "sandbox-base": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "service-map": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "sandbox-map": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    },
                    "event-map": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Oskari DIV Manazer",
            "bundleinstancename": "divmanazer",
            "fi": "Oskari DIV Manazer",
            "sv": "?",
            "en": "Oskari DIV Manazer",
            "bundlename": "divmanazer",
            "metadata": {
                "Import-Bundle": {
                    "divmanazer": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Toolbar",
            "bundleinstancename": "toolbar",
            "fi": "toolbar",
            "sv": "?",
            "en": "?",
            "bundlename": "toolbar",
            "metadata": {
                "Import-Bundle": {
                    "toolbar": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "StateHandler",
            "bundleinstancename": "statehandler",
            "fi": "jquery",
            "sv": "?",
            "en": "?",
            "bundlename": "statehandler",
            "metadata": {
                "Import-Bundle": {
                    "statehandler": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Info Box",
            "bundleinstancename": "infobox",
            "fi": "infobox",
            "sv": "?",
            "en": "?",
            "bundlename": "infobox",
            "metadata": {
                "Import-Bundle": {
                    "infobox": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Haku",
            "bundleinstancename": "search",
            "fi": "search",
            "sv": "?",
            "en": "?",
            "bundlename": "search",
            "metadata": {
                "Import-Bundle": {
                    "search": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Karttatasot",
            "bundleinstancename": "layerselector2",
            "fi": "layerselector",
            "sv": "?",
            "en": "?",
            "bundlename": "layerselector2",
            "metadata": {
                "Import-Bundle": {
                    "layerselector2": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Valitut karttatasot",
            "bundleinstancename": "layerselection2",
            "fi": "layerselection",
            "sv": "?",
            "en": "?",
            "bundlename": "layerselection2",
            "metadata": {
                "Import-Bundle": {
                    "layerselection2": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Omat tiedot",
            "bundleinstancename": "personaldata",
            "fi": "personaldata",
            "sv": "?",
            "en": "?",
            "bundlename": "promote",
            "metadata": {
                "Import-Bundle": {
                    "promote": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Koordinaattin�ytt�",
            "bundleinstancename": "coordinatedisplay",
            "fi": "coordinatedisplay",
            "sv": "?",
            "en": "?",
            "bundlename": "coordinatedisplay",
            "metadata": {
                "Import-Bundle": {
                    "coordinatedisplay": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "maplegend",
            "fi": "maplegend",
            "bundleinstancename": "maplegend",
            "sv": "maplegend",
            "en": "maplegend",
            "bundlename": "maplegend",
            "metadata": {
                "Import-Bundle": {
                    "maplegend": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "UserGuide",
            "bundleinstancename": "userguide",
            "fi": "userguide",
            "sv": "?",
            "en": "?",
            "bundlename": "userguide",
            "metadata": {
                "Import-Bundle": {
                    "userguide": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Metadata Flyout",
            "bundleinstancename": "metadataflyout",
            "fi": "metadataflyout",
            "sv": "?",
            "en": "?",
            "bundlename": "metadataflyout",
            "metadata": {
                "Import-Bundle": {
                    "metadataflyout": {
                        "bundlePath": "/Oskari/packages/catalogue/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "Featuredata",
            "bundleinstancename": "featuredata",
            "fi": "Kohdetiedot",
            "sv": "?",
            "en": "?",
            "bundlename": "featuredata",
            "metadata": {
                "Import-Bundle": {
                    "featuredata": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "guidedtour",
            "fi": "guidedtour",
            "bundleinstancename": "guidedtour",
            "sv": "guidedtour",
            "en": "guidedtour",
            "bundlename": "guidedtour",
            "metadata": {
                "Import-Bundle": {
                    "guidedtour": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "instanceProps": {},
            "title": "backendstatus",
            "fi": "backendstatus",
            "bundleinstancename": "backendstatus",
            "sv": "backendstatus",
            "en": "backendstatus",
            "bundlename": "backendstatus",
            "metadata": {
                "Import-Bundle": {
                    "backendstatus": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }, {
            "title": "Printout",
            "fi": "Karttatuloste",
            "sv": "Kartutskrift",
            "en": "Map Printout",
            "bundlename": "printout",
            "bundleinstancename": "printout",
            "metadata": {
                "Import-Bundle": {
                    "printout": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            },
            "instanceProps": {}
        }, {
            "title": "PostProcessor",
            "fi": "PostProcessor",
            "sv": "PostProcessor",
            "en": "PostProcessor",
            "bundlename": "postprocessor",
            "bundleinstancename": "postprocessor",
            "metadata": {
                "Import-Bundle": {
                    "postprocessor": {
                        "bundlePath": "/Oskari/packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            },
            "instanceProps": {}
        }, {
            "bundleinstancename": "statsgrid",
            "bundlename": "statsgrid",
            "metadata": {
                "Import-Bundle": {
                    "statsgrid": {
                        "bundlePath": "/Oskari/packages/statistics/bundle/"
                    },
                    "geostats": {
                        "bundlePath": "/Oskari/packages/libraries/bundle/"
                    }
                }
            }
        }
    ],
    "configuration" : {
        "backendstatus": {
            "state": {},
            "conf": {}
        },
        "guidedtour": {
            "state": {},
            "conf": {}
        },
        "toolbar": {
            "state": {
                "selected": {
                    "id": "select",
                    "group": "basictools"
                }
            },
            "conf": {
                "viewtools": {
                    "print": false
                }
            }
        },
        "layerselection2": {
            "state": {},
            "conf": {}
        },
        "userguide": {
            "state": {},
            "conf": {}
        },
        "statsgrid": {
            "state": {},
            "conf": {
                "stateful": true,
                "viewClazz": "Oskari.statistics.bundle.statsgrid.StatsView",
                "sandbox": "sandbox",
                "name": "StatsGrid"
            }
        },
        "layerselector2": {
            "state": {
                "tab": "Aiheittain",
                "filter": "",
                "groups": []
            },
            "conf": {}
        },
        "metadataflyout": {
            "state": {},
            "conf": {}
        },
        "mapfull": {
            "state": {
                "selectedLayers": [
                    {
                        "id": "base_35",
                        "opacity": 100
                    }
                ],
                "zoom": 1,
                "srs": "EPSG:3067",
                "north": 6935042,
                "east": 540620
            },
            "conf": {
                "globalMapAjaxUrl": "/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&",
                "plugins": [
                    {
                        "id": "Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.mapmodule.WmsLayerPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.mapmodule.MarkersPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.mapmodule.ControlsPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.mapmodule.GetInfoPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar"
                    },
                    {
                        "id": "Oskari.mapframework.bundle.mapmodule.plugin.PanButtons"
                    },
                    {
                        "id": "Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.bundle.mapmodule.plugin.GeoLocationPlugin"
                    },
                    {
                        "id": "Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin"
                    }
                ],
                "layers": [
                    {
                        "styles": {},
                        "baseLayerId": 35,
                        "type": "base",
                        "orgName": "Taustakartat",
                        "formats": {},
                        "isQueryable": false,
                        "id": "base_35",
                        "minScale": 15000000,
                        "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                        "names": {
                            "fi": "Taustakartat",
                            "sv": "Bakgrundskartor",
                            "en": "Background Maps"
                        },
                        "name": "Taustakartat",
                        "permissions": {
                            "publish": "no_publication_permission"
                        },
                        "subLayer": [
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_5k",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 184,
                                "minScale": 5000,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "updated": "Fri Aug 31 10:21:16 EEST 2012",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 21,
                                "name": "Taustakartta 1:5000",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 1
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_10k",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 185,
                                "minScale": 25001,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "updated": "Fri Aug 31 10:24:04 EEST 2012",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 22,
                                "name": "Taustakartta 1:10k",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 5001
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_20k",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 186,
                                "minScale": 40001,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "updated": "Fri Aug 31 10:24:17 EEST 2012",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 23,
                                "name": "Taustakartta 1:20k",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 25001
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_40k",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 187,
                                "minScale": 2,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 24,
                                "name": "Taustakartta 1:40k",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 1
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_80k",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 188,
                                "minScale": 56702,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 25,
                                "name": "Taustakartta 1:80k",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 40000
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_160k",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 189,
                                "minScale": 141742,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 26,
                                "name": "Taustakartta 1:160k",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 56702
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_320k",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 190,
                                "minScale": 283474,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 27,
                                "name": "Taustakartta 1:320k",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 141742
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_800k",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 191,
                                "minScale": 566939,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 28,
                                "name": "Taustakartta 1:800k",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 283474
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_2m",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 192,
                                "minScale": 1417333,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 29,
                                "name": "Taustakartta 1:2milj",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 566939
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_4m",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 193,
                                "minScale": 2834657,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 30,
                                "name": "Taustakartta 1:4milj",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 1417333
                            },
                            {
                                "dataUrl_uuid": "c22da116-5095-4878-bb04-dd7db3a1a341",
                                "wmsName": "taustakartta_8m",
                                "descriptionLink": "",
                                "styles": {},
                                "geom": "POLYGON ((-327719.5576350207 2269951.782944744, 200092.5343070085 7795671.299774553, 674163.1411776261 7782724.387222701, 979121.6313786274 2256671.3642475777, -327719.5576350207 2269951.782944744))",
                                "baseLayerId": 35,
                                "orgName": "Taustakartat",
                                "type": "wmslayer",
                                "legendImage": "",
                                "formats": {},
                                "isQueryable": false,
                                "id": 194,
                                "minScale": 15000000,
                                "dataUrl": "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
                                "style": "",
                                "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                                "orderNumber": 31,
                                "name": "Taustakartta 1:8milj",
                                "permissions": {
                                    "publish": "no_publication_permission"
                                },
                                "opacity": 100,
                                "subtitle": "",
                                "inspire": "Opaskartat",
                                "maxScale": 2834657
                            }
                        ],
                        "inspire": "Taustakartat",
                        "maxScale": 1
                    }
                ],
                "imageLocation": "/Oskari/resources",
                "user": {
                    "userID": 10110,
                    "lastName": "",
                    "nickName": "10110",
                    "userUUID": "",
                    "firstName": "",
                    "loginName": "default@maanmittauslaitos.fi"
                }
            }
        },
        "personaldata": {
            "state": {},
            "conf": {
                "register": {
                    "fi": "Rekisteröidy",
                    "sv": "Rekisteröidy",
                    "en": "Register"
                },
                "toolbarButtons": {
                    "myplaces": {
                        "point": {
                            "iconCls": "myplaces-draw-point",
                            "tooltip": {
                                "fi": "Lisää piste - Kirjaudu sisään käyttääksesi",
                                "sv": "Tillägg punkt - Logga in för att använda",
                                "en": "Add point - Log in to use"
                            }
                        },
                        "area": {
                            "iconCls": "myplaces-draw-area",
                            "tooltip": {
                                "fi": "Lisää alue - Kirjaudu sisään käyttääksesi",
                                "sv": "Tillägg område - Logga in för att använda",
                                "en": "Add area - Log in to use"
                            }
                        },
                        "line": {
                            "iconCls": "myplaces-draw-line",
                            "tooltip": {
                                "fi": "Lisää viiva - Kirjaudu sisään käyttääksesi",
                                "sv": "Tillägg linje - Logga in för att använda",
                                "en": "Add line - Log in to use"
                            }
                        }
                    }
                },
                "title": {
                    "fi": "Omat tiedot",
                    "sv": "Mina uppgifter",
                    "en": "My data"
                },
                "signupUrl": {
                    "fi": "/web/fi/login",
                    "sv": "/web/sv/login",
                    "en": "/web/en/login"
                },
                "desc": {
                    "fi": "Omiin tietoihin voit tallentaa omia karttanäkymiä ja kohteita sekä nähdä muille sivustoille julkaisemasi kartat.",
                    "sv": "Du kan lagra dina egna kartvyer och titta på kartor som du har inbäddat på andra webbplatser i Mina uppgifter.",
                    "en": "You can save map views and browse maps that you have embedded on other websites in My data."
                },
                "registerUrl": {
                    "fi": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
                    "sv": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
                    "en": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
                },
                "__name": "Personaldata",
                "signup": {
                    "fi": "Kirjaudu palveluun",
                    "sv": "Logga in",
                    "en": "Log in"
                }
            }
        },
        "publisher": {
            "state": {},
            "conf": {
                "register": {
                    "fi": "Rekisteröidy",
                    "sv": "Registrera dig",
                    "en": "Register"
                },
                "title": {
                    "fi": "Julkaise kartta",
                    "sv": "Definiera karta",
                    "en": "Create map"
                },
                "signupUrl": {
                    "fi": "/web/fi/login",
                    "sv": "/web/sv/login",
                    "en": "/web/en/login"
                },
                "desc": {
                    "fi": "Voit käyttää julkaisutoimintoa kirjauduttuasi palveluun.",
                    "sv": "Logga in i tjänsten för att definiera en karta som ska inbäddas.",
                    "en": "You need to log in before using the embedding function."
                },
                "registerUrl": {
                    "fi": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
                    "sv": "/web/sv/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
                    "en": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
                },
                "__name": "Publisher",
                "signup": {
                    "fi": "Kirjaudu sisään",
                    "sv": "Logga in",
                    "en": "Log in"
                }
            }
        },
        "printout": {
            "state": {},
            "conf": {
                "backendConfiguration": {
                    "formatProducers": {
                        "image/png": "http://wps.paikkatietoikkuna.fi/dataset/map/process/imaging/service/thumbnail/maplink.png?",
                        "application/pdf": "http://wps.paikkatietoikkuna.fi/dataset/map/process/imaging/service/thumbnail/maplink.pdf?"
                    }
                }
            }
        },
        "openlayers-default-theme": {
            "state": {},
            "conf": {}
        },
        "search": {
            "state": {},
            "conf": {}
        },
        "maplegend": {
            "state": {},
            "conf": {}
        },
        "featuredata": {
            "state": {},
            "conf": {
                "selectionTools": true
            }
        },
        "divmanazer": {
            "state": {},
            "conf": {}
        },
        "statehandler": {
            "state": {},
            "conf": {}
        },
        "infobox": {
            "state": {},
            "conf": {
                "adaptable": true
            }
        },
        "coordinatedisplay": {
            "state": {},
            "conf": {}
        }
    }
	}

### Build process

The minified build is done with grunt using requirejs, which uses the configuration from the build.js
Grunt can also be configured directly as done with oskari, however the oskari build is unstable and should not be used at the time of writing. See the Gruntfile for details.

	grunt requirejs:full-map_guest

### Sample build.js
	
	require.config({
	    baseUrl : "../../../",
	    paths : {
	        oskari: "bundles/oskari/oskari",
	        'oskari-with-loader': "bundles/oskari/oskari-with-loader",
	        jquery: "empty:",
	        'jquery-migrate': "libraries/jquery/jquery-migrate-1.2.1-modified",
	        mainConfig: "applications/oskari2/full-map_guest/mainConfig",
	        css: "libraries/requirejs/lib/css",
	        json: "libraries/requirejs/lib/json",
	        domReady: "libraries/requirejs/lib/domReady",
	        normalize: "libraries/requirejs/lib/normalize",
	        'css-builder': "libraries/requirejs/lib/css-builder"
	    },
	    map: {
	      // '*' means all modules will get 'jquery-private'
	      // for their 'jquery' dependency.
	      '*': {
	        "jquery": "jquery-migrate"
	      },
	      // 'jquery-private' wants the real jQuery module
	      // though. If this line was not here, there would
	      // be an unresolvable cyclic dependency.
	      'jquery-migrate': { 'jquery': 'jquery' },
	    },
	    optimizeAllPluginResources: true,
	    findNestedDependencies: true,
	    name: "applications/oskari2/full-map_guest/main-dev",
	    out: "main.js"
	});
