# Configuring thematic maps functionality

See [requirements](requirements) for enabling the code that powers the thematic maps functionality.

## Adding region sets as maplayers

Regionsets used for thematic maps are configured in pretty much the same way you might register a wms-layer for Oskari database:

    INSERT INTO oskari_maplayer(type, url,
                        name, groupId,
                        locale,
                        attributes)
    VALUES(
        'statslayer', 'http://mydomain.com/geoserver/wms', 
        'mylayer', (SELECT MAX(id) FROM oskari_layergroup),
        '{ "en" : {
            "name":"Municipalities"
        }}',
        '{
            "statistics" : {
                "featuresUrl":"http://mydomain.com/geoserver/oskari/wfs",
                "regionIdTag":"id",
                "nameIdTag":"name"
            }
        }');

Where 
- type of the layer is 'statslayer'
- the url and name should match a layer in a WMS-service
- locale is a JSON with language code at the first level and UI-name of the layer/regionset as the name value. It supports multiple languages as any other maplayers in Oskari.
- groupId is a link to the data provider/organization that provides the layer
- additional configuration for the attributes column are:

- featuresUrl: URL for corresponding WFS-service. It's used to read all the features to create a list of regions in the region set

- regionIdTag: feature attribute that is the unique id for that region (like municipality/postal/zip code). This is used to map statistics data to a region

- nameIdTag: feature attribute that has the name for the region (this is shown to the end-user as the region name)

The WMS-service should allow SLD_BODY to be posted. An SLD is dynamically created based on the end-user selections for data classification to create a thematic map. Any WMS-service will do. You can use the bundled geoserver to host it or use a service from another service.

*Note! Add the [view permissions](/documentation/backend/permissions) for the layer so  users can see it.*

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

#### PxWEB

PX-Web is a widely used statistics software that offers an API for accessing the data.

Code: https://github.com/oskariorg/oskari-server/blob/develop/service-statistics-pxweb/src/main/java/fi/nls/oskari/control/statistics/plugins/pxweb/PxwebStatisticalDatasourceFactory.java

Datasource config:

    {
        "url" : "http://some.pxweb.com/statdb",
        "regionKey" : "name of the attribute for the region id in stats data",
        "ignoredVariables": ["any", "attributes", "that", "should", "be", "ignored"]
    }

#### SotkaNET

The Sotkanet Indicator Bank is an API provided by Finnish National Institute for Health and Welfare (THL). It is also used by National Land Survey of Finland to share statistics.

Code: https://github.com/oskariorg/oskari-server/blob/develop/service-statistics-sotka/src/main/java/fi/nls/oskari/control/statistics/plugins/sotka/SotkaStatisticalDatasourceFactory.java

Datasource config:

    {
        "url" : "http://www.sotkanet.fi/rest"
    }

## Linking datasources and regionsets

Not all datasources have data for all of the regionsets so as the last step you need to link layers/regionsets that can be used with a given datasource.


    INSERT INTO 
        oskari_statistical_layer(datasource_id, layer_id, config)
    VALUES(
        (SELECT id FROM oskari_statistical_datasource 
            WHERE locale like '%Health and Welfare%'),
        (SELECT id FROM oskari_maplayer WHERE type='statslayer' AND name = 'mylayer'),
        {});

The config is an adapter specific configuration that can be used to pass information datasource specific information for the layer. 

The current layer configuration options are listed below.

### Eurostat

Doesn't use layer config, but could be used to detect which layer is used for which type of areas (NUTS 1,2,3).

### PxWEB

Doesn't use layer config, but could be used to detect which layer is used for which type of areas in the statistics data or provide a fully qualified class name for doing the layer/statistics data mapping for more involved functionality.

#### SotkaNET

Uses config:

    {
        "regionType" : "municipality"
    }

The Sotkanet data includes hints to indicate that the data is for municipalities or larger areas. The value of regionType should match this hint. For example statistics for municipality might have a region type hint of "kunta" in the stats data. When linking a layer that has municipalities as regions the config should have regionType "kunta". This helps the functionality to filter out layers that don't have data for given regionset off from the user interface.

# Known issues

- performance is not as good as it should before data is cached.

- database configuration is cached on server startup so any changes to database for the statistics functionality will require a server restart. This includes for example regions in regionsets and datasources.

- There is no user interface to configure datasources so they need to be administrated with SQL
