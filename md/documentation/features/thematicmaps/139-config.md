# Configuring thematic maps functionality

See [requirements](requirements) for enabling the code that powers the thematic maps functionality.

## Adding regionsets as maplayers

Regionsets used for thematic maps are configured in pretty much the same way you might register a wms-layer for Oskari database:

    INSERT INTO oskari_maplayer(type, url,
                        name, dataprovider_id,
                        locale,
                        attributes, internal, srs_name)
    VALUES(
        'statslayer', 'http://mydomain.com/geoserver/wms',
        'mylayer', (SELECT MAX(id) FROM oskari_dataprovider),
        '{ "en" : {
            "name":"Municipalities"
        }}',
        '{
            "statistics" : {
                "featuresUrl":"http://mydomain.com/geoserver/oskari/wfs",
                "regionIdTag":"id",
                "nameIdTag":"name"
            }
        }', true, 'EPSG:4326');

Where
- type of the layer is 'statslayer'
- the url and name should match a layer in a WFS-service (The URL isn't used for anything but permission mapping at this point)
- locale is a JSON object with language code at the first level and UI-name of the layer/regionset as the name value. It supports multiple languages as any other maplayers in Oskari.
- groupId is a link to the data provider/organization that provides the layer
- additional configuration for the attributes column are:

- featuresUrl: URL for corresponding WFS-service. It's used to read all the features to create a list of regions in the region set (this URL is used for now instead of the actual url-field)

- regionIdTag: feature attribute that is the unique id for that region (like municipality/postal/zip code). This is used to map statistics data to a region

- nameIdTag: feature attribute that has the name for the region (this is shown to the end-user as the region name)

You can use the bundled geoserver to host the regionset layer or use a WFS-service from an external provider.

*Note! Add the [view permissions](/documentation/backend/permissions) for the layer so  users can see it.*

### Regionset as JSON resource

As of 1.46.0 Oskari version regionsets don't need to come from a WFS-service and having them as resource files under the webserver works as well:

**1. Make your GeoJSON resource file available for the webapp container.**

Store the file to the root resource directory for your web application (for example $JETTY_HOME/resources).
When adding a resource file as a regionset layer configure featuresUrl in layer attributes as follows:

    "resources://${path}"

Where ${path} is relative to the root resource directory in your web application. For example having the file
 in $JETTY_HOME/resources/regionsets/myfile.json would mean featuresUrl value of "resources://regionsets/myfile.json"

*Note! The featuresUrl must start with "resources://" for the system to recognize that this layer is resource based and the file-extension MUST be '.json'.*

**2. The features describing the Regions in your GeoJSON resource need to have atleast two properties.**

 - One describing the id of the Region (the property name is configured as regionIdTag like in WFS-based config)
 - Another describing the name of the Region (the property name is configured as nameIdTag like in WFS-based config)

*Note! It's expected that the geometry in GeoJSON files is in the projection referenced in the srs_name column on oskari_maplayer for the regionset.*

## Adding a datasource

A datasource can be registered with a simple SQL:

    INSERT INTO oskari_statistical_datasource(locale, config, plugin)
    VALUES('{
        "en" : {
            "name":"Health and Welfare"
        }}',
        '{
            "url" : "http://www.sotkanet.fi/rest"
        }', 'SotkaNET');

Where:
- locale is a JSON with language code at the first level and UI-name of the datasource as the name value. It supports multiple languages like maplayers in Oskari.
- config is an adapter specific configuration that is used to give the adapter code hints how to process the datasource
- plugin is the ID for the adapter code to use for this datasource

Config can also include additional info about datasource and hints for sorting indicator data dimension values to be shown to user:

    {
      "info" : {
        "url" : "https://moreinfo.here"
      },
      "hints" : {
        "dimensions" : [ {
          "id" : "year",
          "sort" : "DESC"
        }, {
          "id" : "gender",
          "default" : "total"
        }]
      }
    }

Where id value will match the id of a data dimension item in indicator datamodel. Other keys affect the order of allowed values for that dimension. Sort (if present) will be done first with either DESC or ASC value. If default is present the matching allowed value will be moved as the first value in allowed values. You can use both, one or none.

The info-block is sent to the frontend code as is and the url (if provided) is shown as part of the attribution data for selected indicators.

### Plugins/adapters

Plugins or adapters are used to interpret the statistics data API to a common format recognized by the Oskari frontend and map the statistics data to regions. There are a few API adapters available in Oskari and the oskari-server can be easily extended with additional adapters.

#### Eurostat

Eurostat is the statistical office of the European Union situated in Luxembourg. Its mission is to provide high quality statistics for Europe. They offer an API that uses SDMX and JSON-stat as dataformats.

Code: https://github.com/oskariorg/oskari-server/blob/develop/service-statistics-eurostat/src/main/java/fi/nls/oskari/statistics/eurostat/EurostatStatisticalDatasourceFactory.java

Datasource config:

    {
        "url" : "http://ec.europa.eu/eurostat"
    }

#### PxWeb

PxWeb is a widely used statistics software that offers an API for accessing the data.

Code: https://github.com/oskariorg/oskari-server/blob/develop/service-statistics-pxweb/src/main/java/fi/nls/oskari/control/statistics/plugins/pxweb/PxwebStatisticalDatasourceFactory.java

Datasource config:

    {
        "url" : "http://some.pxweb.com/statdb",
        "regionKey" : "name of the attribute for the region id in stats data",
        "ignoredVariables": ["optional config", "any", "attributes", "that", "should", "be", "ignored"],
        "timeVariable": "Optional config for id of the variable that describes time like 'year'. This is used for time-series functionality.",
        "metadataFile": "/file/in/classpath.json (optional)"
    }

The metadataFile configuration allows linking more metadata for indicators in the datasource like source for data, name/descriptions overrides for values from the API and configuring the type of data for selecting if it will be visualized as choropleth or point symbols by default etc. The value should point to a file in the server classpath. The format of the JSON is an array with objects like:

    [{
        "code": "M408",
        "desc": {
            "fi": "Taajama-aste tarkoittaa taajamissa asuvien osuutta väestöstä, jonka sijainti tunnetaan. Taajamaksi määritellään kaikki vähintään 200 asukkaan rakennusryhmät, joissa rakennusten välinen etäisyys ei yleensä ole 200 metriä suurempi"
        },
        "source": {
            "fi": "Väestörakenne"
        },
        "isRatio": true,
        "base": 100,
        "min": -100,
        "max": 500,
        "decimalCount": 1,
        "timerange": {
            "start": "1987",
            "end": "2015"
        },
        "updated": "1.4.2016",
        "nextUpdate": "29.3.2017"
    }, ...]

- `code` value is used to map the indicator between the metadata JSON and data from the PxWeb API and id should match the indicator id.
- `timerange` can be used to configure indicator specific timeranges if they are all in the same .px file. 
- `updated` and `nextUpdate` are shown in the UI with the indicator description. 
- `isRatio` (optional boolean): `true` for `choropleth`, `false` for `points`
- `base` (optional number): with number value the classification `distribution` is set to `Diverging`. Missing or non-numeric value `distribution` defaults to `Quantitative`
- `min` and `max` describe the data but is not used by the frontend currently

#### SotkaNET

The Sotkanet Indicator Bank is an API provided by Finnish National Institute for Health and Welfare (THL). It is also used by National Land Survey of Finland to share statistics.

Code: https://github.com/oskariorg/oskari-server/blob/develop/service-statistics-sotka/src/main/java/fi/nls/oskari/control/statistics/plugins/sotka/SotkaStatisticalDatasourceFactory.java

Datasource config:

    {
        "url" : "http://www.sotkanet.fi/rest",
        "timeVariable": "Optional config for id of the variable that describes time like 'year'. This is used for time-series functionality. Defaults to 'year' for SotkaNET if not configured."
    }

## Linking datasources and regionsets

Not all datasources have data for all of the regionsets so as the last step you need to link layers/regionsets that can be used with a given datasource.


    INSERT INTO 
        oskari_statistical_datasource_regionsets(datasource_id, layer_id, config)
    VALUES(
        (SELECT id FROM oskari_statistical_datasource 
            WHERE locale like '%Health and Welfare%'),
        (SELECT id FROM oskari_maplayer WHERE type='statslayer' AND name = 'mylayer'),
        '{}');

The config is an adapter specific configuration that can be used to pass information datasource specific information for the layer.

The current layer configuration options are listed below.

### Eurostat

Doesn't use layer config, but could be used to detect which layer is used for which type of areas (NUTS 1,2,3).

### PxWeb

Doesn't use layer config, but could be used to detect which layer is used for which type of areas in the statistics data or provide a fully qualified class name for doing the layer/statistics data mapping for more involved functionality.

#### SotkaNET

Uses config:

    {
        "regionType" : "kunta"
    }

The value of "regionType" should match the "category" value  (like "kunta") in Sotkanet regions response. It's used to filter out indicators that the service has, but which don't have a regionset in the Oskari instance and as such can't be visualized in Oskari. Sotkanet data responses include data for all the regionsets and the same config is used to filter the data before it's passed to the frontend in Oskari.

# Known issues

- performance is not as good as it should before data is cached.

- database configuration is cached on server startup so any changes to database for the statistics functionality will require a server restart. This includes for example regions in regionsets and datasources.

- There is no user interface to configure datasources so they need to be administrated with SQL
