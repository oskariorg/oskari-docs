# Configuring wfs path parser

## 1. Summary

* WFS path parser is generic parser for complex wfs services / feature types
* Use this config when wfs service is not simple feature service
* e.g. ELF and RYSP wfs services are complex feature services


## 2. Sample WFS FE path parser layer config

* look comments at ..\elf-oskari-server-extensions\elf-resources\resources\sql\elf-nls_fi-lod0ad-Cascading-wfslayer.sql file

## 2. Sample path parser config  (portti_wfs_template_model.parse_config column / json format)


    '{
    "scan": {   <--- 1st level element to loop in response gml
        "scanNS": "http://www.opengis.net/wfs/2.0",
        "name": "member"
    },
    "root": {  <--- feature type element to loop inside scan element (naming is not optimal)
        "rootNS": "http://www.locationframework.eu/schemas/Addresses/MasterLoD0/1.0",
        "name": "Address"
    },
    "paths": [{   <--- elements to parse for
        "path": "/elf-lod0ad:Address/@gml:id",
        <--- absolut xpath - the syntax is xpath, but there is no xpath parsing
        <--- if there is '@' char in path, then xml attribute will be parsed
        "type": "String",
        <--- data type
        <--- String; default type
        <--- Object; path setup is pointing to element, which has children elements. Content is parsed as json object
        <--- Geometry: path setup is pointing to element, which 1st child is GML geometry element
        <--- Href; path attribute is #href (local reference to additional objects in tail of gml/xml stream response
        <---       This data type needs extra setup for parsing addtional objects - see below
        "label": "id"      <--- title in user interface
    }, {
        "path": "/elf-lod0ad:Address/ad:inspireId/base:Identifier/base:localId",
        "type": "String",
        "label": "InspireLocalId"
    }, {
        "path": "/elf-lod0ad:Address/ad:inspireId/base:Identifier/base:versionId",
        "type": "String",
        "label": "InspireVersionId"
    }, {
        "path": "/elf-lod0ad:Address/ad:position/ad:GeographicPosition/ad:geometry",
        "type": "Geometry",
        "label": "geom"
    }, {
        "path": "/elf-lod0ad:Address/ad:locator/ad:AddressLocator/ad:designator/ad:LocatorDesignator",
        "type": "Object",
        "label": "addressLocatorDesignators"
    }, {
        "path": "/elf-lod0ad:Address/ad:validFrom",
        "type": "String",
        "label": "validFrom"
    }, {
        "path": "/elf-lod0ad:Address/ad:validTo",
        "type": "String",
        "label": "validTo"
    }, {
        "path": "/elf-lod0ad:Address/ad:beginLifespanVersion",
        "type": "String",
        "label": "beginLifespanVersion"
    }, {
        "path": "/elf-lod0ad:Address/ad:endLifespanVersion",
        "type": "String",
        "label": "endLifespanVersion"
    },{
        "path": "/elf-lod0ad:Address/ad:component/@xlink:title",
        "type": "String",
        "label": "title"},
        {
        "path": "/elf-lod0ad:Address/ad:component/@xlink:href",
        "type": "Href",
        "label": "components",
        "hrefPath": [{  <------ extra parse setup for addtional features, to where local hrefs are pointing (#href)
            "path": "/wfs:SimpleFeatureCollection/wfs:member/elf-lod0ad:AdminUnitName/@gml:id",
             <---- gml:id is the reference key for local #href
            "type": "String",
            "label": "id"
        }, {
            "path": "/wfs:SimpleFeatureCollection/wfs:member/elf-lod0ad:AdminUnitName/ad:inspireId/base:Identifier/base:namespace",
            "type": "String",
            "label": "type"
        }, {
            "path": "/wfs:SimpleFeatureCollection/wfs:member/elf-lod0ad:AdminUnitName/ad:name/gn:GeographicalName/gn:language",
            "type": "String",
            "label": "language"
        }, {
            "path": "/wfs:SimpleFeatureCollection/wfs:member/elf-lod0ad:AdminUnitName/ad:name/gn:GeographicalName/gn:spelling/gn:SpellingOfName/gn:text",
            "type": "String",
            "label": "name"
        }, {
            "path": "/wfs:SimpleFeatureCollection/wfs:member/elf-lod0ad:ThoroughfareName/@gml:id",
            "type": "String",
            "label": "id"
        }, {
            "path": "/wfs:SimpleFeatureCollection/wfs:member/elf-lod0ad:ThoroughfareName/ad:inspireId/base:Identifier/base:namespace",
            "type": "String",
            "label": "type"
        }, {
            "path": "/wfs:SimpleFeatureCollection/wfs:member/elf-lod0ad:ThoroughfareName/ad:name/gn:GeographicalName/gn:language",
            "type": "String",
            "label": "language"
        }, {
            "path": "/wfs:SimpleFeatureCollection/wfs:member/elf-lod0ad:ThoroughfareName/ad:name/gn:GeographicalName/gn:spelling/gn:SpellingOfName/gn:text",
            "type": "String",
            "label": "name"
        }]
    }]
}

