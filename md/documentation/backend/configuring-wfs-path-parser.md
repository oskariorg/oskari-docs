# Configuring wfs path parser

## 1. Overview

* This setup is for Admin layerselector when inserting WFS 2.0.0 WFS-layers in Oskari
* Seed parser configuration for new WFS-layer (featuretype)  is predefined in oskari_wfs_parser_config db table
* The WFS-layer related data is inserted into several tables in oskari DB in the layer insertion
   1. common items into oskari_maplayer table
   2. wfs-spesific items into portti_wfs_layer table
   3. wfs-parser-spesific items into portti_wfs_template_model table
   4. SLD-style spesific items into tables portti_wfs_layer_style and portti_wfs_layer_styles (optional)

## 2. Summary

* WFS path parser is generic parser for complex wfs services / feature types
* Use this config when wfs service is not simple feature service
* e.g. ELF and RYSP wfs services are complex feature services
* 'Path' parser is only supported for WFS 2.0.0 for time being. Some 'Pull' and 'Groovy' parsers are available for WFS 1.1.0
* Default path parser config is already initialized in the DB, so in general there is no need to configure
  any extra for new WFS 2.0.0 layer


## 3. Configuration setup for initial parser configurations

* Available initial parsing configurations for new WFS 2.0.0 feature types are defined in oskari_wfs_parser_config db table

  There could be several configs  for one feature type, but in this moment first one is in use

* Default sld style is used, if "sld_style" parameter is not defined for new featuretype. Default style are defined in service-feature-engine resources.

  (e.g. service-feature-engine\src\example\resources\fi\nls\oskari\fe\output\style\default\default_fe_sld_<geometry property name>.xml (e.g. default_fe_sld_geometry.xml)

* Default parser is used, if there is no parser configuration for current new layer ( feature type )

* Names of default path parser classes:

  ELF_wfs_DefaultParser (geometry is parsed and all text nodes according to structure of first found feature)
  ELF_wfs_Parser  ( geometry and gml id is parsed with this parser)

**Recommendation: Use "Path" parser type for new featuretype parser configs, it doesn't need any predefined java programming**

**Use of sld_style config is not yet implemented**


* Sample initial interface in backend (JSON / WFSParserConfigs.java), which is fetched from oskari_wfs_parser_config table:


     ' {"au:AdministrativeUnit": [   <-- WFS featuretype name always with namespace prefix (FeatureType name in GetCapabilities response)
            {
              "type": "Groovy",   <-- parser type (common information for the user)
              "request_template": "oskari-feature-engine:QueryArgsBuilder_WFS_GET",   <-- GetFeature request template
              "response_template": "/fi/nls/oskari/fe/input/format/gml/au/INSPIRE_generic_AU.groovy",  <-- predefinen  groovy file name
              "sld_style": "/fi/nls/oskari/fe/output/style/INSPIRE_SLD/AU.AdministrativeUnit.Default.xml" <-- predefined sld style file name
            }
          ],
     "default": [   <-- This config is used, if there is no featuretype based config found
       {
         "type": "Path",
         "request_template": "/fi/nls/oskari/fe/input/request/wfs/generic/ELF_generic_wfs_template.xml",
         "response_template": "fi.nls.oskari.eu.elf.recipe.universal.ELF_wfs_DefaultParser",
         "parse_config": {
           "scan": {
             "scanNS": "http://www.opengis.net/wfs/2.0",
             "name": "member"
           },
           "root": {
             "rootNS": "[via application]",
             "name": "[via application]"
           },
           "paths": [
             {
               "path": "[via application]",
               "type": "String",
               "label": "id"
             }
           ]
         }
       }
     ]
     }'

* How to prepare new featuretype seed config for Path parser type, if default parser is not used


   + Copy one existing "Path"-type row in oskari_wfs_parser_config table and insert it as new row
   + Edit new row and replace "paths" definition  (use GetFeature request to find out which property elements are available for this featuretype
   e.g. http://wfs.geonorge.no/skwms1/wfs.elf-gn?service=WFS&version=2.0.0&request=GetFeature&typeNames=elf-gn:NamedPlace&count=2
   + and save table row

* How to prepare new featuretype config for other parser types, if default is not used


   + Scan \oskari-server\service-feature-engine source code for to find out, which "pull" or "groovy" parsers are available
   + Copy some parser as a basis and recode it for the new featuretype (e.g.fi.nls.oskari.eu.elf.recipe.geographicalnames.ELF_MasterLoD1_NamedPlace_Parser.java)
   + Copy Jackson featuretype mapping class (import reference of parser class) as a basis and recode it  (e.g. fi.nls.oskari.eu.elf.geographicalnames.ELF_MasterLoD1_NamedPlace.NamedPlace.java)
   + Copy some GetFeature template file, if generic (ELF_generic_wfs_template.xml) is not suitable,rename it and  edit it (modify featuretype name, geom name, etc)
   + Copy sld style file of some previous pull or groovy parser, rename it and edit it  (Option, default style is used, if undefined)
   + all above config files are resource files under  oskari-server\service-feature-engine
   + Copy one existing "Pull" or "Groovy"-type row in oskari_wfs_parser_config table and insert it as new row
   + Edit new row and replace "request_template", "response_template", "sld_style"
   + and save table row

*  How to edit  WFS-layer parser config for a layer, which is already stored
   + edit layer related row in table portti_wfs_template_model
   + use same basis for column contents as for table  oskari_wfs_parser_config above


## 4. Sample WFS 2.0.0 FE path parser layer config

* Get GetFeature response e.g. by means of FF Poster


   url: http://54.228.221.191/ELFcascadingWFS/service
   post:

    '<wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:fes="http://www.opengis.net/fes/2.0" xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:hy-p="http://inspire.ec.europa.eu/schemas/hy-p/4.0rc1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" count="2" outputFormat="application/gml+xml; version=3.2" resolveDepth="*" service="WFS" version="2.0.0" xsi:schemaLocation="http://www.opengis.net/wfs/2.0   http://schemas.opengis.net/wfs/2.0.0/wfs.xsd">
                 <wfs:Query srsName="EPSG:900913" typeNames="hy-p:LandWaterBoundary">
                         <fes:Filter>
                                 <fes:BBOX>
                                         <gml:Envelope srsName="EPSG:900913">
                                                 <gml:lowerCorner>539577.01416249 8231889.9537558</gml:lowerCorner>
                                                 <gml:upperCorner>772251.32823017 8356940.932013</gml:upperCorner>
                                         </gml:Envelope>
                                 </fes:BBOX>
                         </fes:Filter>
                 </wfs:Query>
         </wfs:GetFeature>'


    **Response**

    '<?xml version='1.0' encoding='UTF-8'?>
     <wfs:FeatureCollection xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd http://www.opengis.net/gml/3.2 http://schemas.opengis.net/gml/3.2.1/gml.xsd urn:x-inspire:specification:gmlas:HydroPhysicalWaters:3.0 http://wfs.geonorge.no/skwms1/wfs.inspire-hy-p?SERVICE=WFS&amp;VERSION=2.0.0&amp;REQUEST=DescribeFeatureType&amp;OUTPUTFORMAT=application%2Fgml%2Bxml%3B+version%3D3.2&amp;TYPENAME=hy-p:LandWaterBoundary&amp;NAMESPACES=xmlns(hy-p,urn%3Ax-inspire%3Aspecification%3Agmlas%3AHydroPhysicalWaters%3A3.0)" xmlns:wfs="http://www.opengis.net/wfs/2.0" timeStamp="2015-04-22T09:16:24Z" xmlns:gml="http://www.opengis.net/gml/3.2" numberMatched="2" numberReturned="2">
       <wfs:boundedBy>
         <gml:Envelope srsName="EPSG:900913">
           <gml:lowerCorner>768683.720 8351476.314</gml:lowerCorner>
           <gml:upperCorner>771733.238 8354189.344</gml:upperCorner>
         </gml:Envelope>
       </wfs:boundedBy>
       <wfs:member>
         <hy-p:LandWaterBoundary xmlns:hy-p="urn:x-inspire:specification:gmlas:HydroPhysicalWaters:3.0" gml:id="HY-P_LANDWATERBOUNDARY_37644">
           <hy-p:beginLifespanVersion>1991-07-01T00:00:00</hy-p:beginLifespanVersion>
           <hy-p:endLifespanVersion xsi:nil="true" nilReason="inapplicable"/>
           <hy-p:geometry>
             <!--Inlined geometry 'HY-P_LANDWATERBOUNDARY_37644_HY-P_GEOMETRY'-->
             <gml:LineString gml:id="HY-P_LANDWATERBOUNDARY_37644_HY-P_GEOMETRY" srsName="EPSG:900913">
               <gml:posList>768721.675 8354110.375 768711.556 8354115.998 768703.072 8354133.643 768683.720 8354180.721 768705.267 8354189.344 768709.624 8354177.560 768713.573 8354177.707 768719.770 8354169.924 768721.947 8354164.042 768744.372 8354144.878 768752.660 8354133.219 768745.013 8354125.029 768721.675 8354110.375</gml:posList>
             </gml:LineString>
           </hy-p:geometry>
           <hy-p:inspireId>
             <base:Identifier xmlns:base="urn:x-inspire:specification:gmlas:BaseTypes:3.2">
               <base:localId>37644</base:localId>
               <base:namespace>http://www.kartverket.no/kartografiseksjon/N50/so</base:namespace>
               <base:versionId xsi:nil="true" nilReason="inapplicable"/>
             </base:Identifier>
           </hy-p:inspireId>
           <hy-p:origin xsi:nil="true" nilReason="unknown"/>
           <hy-p:waterLevelCategory xsi:nil="true" nilReason="unknown"/>
         </hy-p:LandWaterBoundary>
       </wfs:member>
       <wfs:member>
         <hy-p:LandWaterBoundary xmlns:hy-p="urn:x-inspire:specification:gmlas:HydroPhysicalWaters:3.0" gml:id="HY-P_LANDWATERBOUNDARY_186284">
           <hy-p:beginLifespanVersion>1991-07-01T00:00:00</hy-p:beginLifespanVersion>
           <hy-p:endLifespanVersion xsi:nil="true" nilReason="inapplicable"/>
           <hy-p:geometry>
             <!--Inlined geometry 'HY-P_LANDWATERBOUNDARY_186284_HY-P_GEOMETRY'-->
             <gml:LineString gml:id="HY-P_LANDWATERBOUNDARY_186284_HY-P_GEOMETRY" srsName="EPSG:900913">
               <gml:posList>771720.360 8351476.314 771702.278 8351483.716 771697.965 8351495.522 771703.586 8351505.613 771715.289 8351511.919 771733.238 8351508.532 771731.697 8351494.571 771729.776 8351492.519 771729.903 8351488.542 771720.360 8351476.314</gml:posList>
             </gml:LineString>
           </hy-p:geometry>
           <hy-p:inspireId>
             <base:Identifier xmlns:base="urn:x-inspire:specification:gmlas:BaseTypes:3.2">
               <base:localId>186284</base:localId>
               <base:namespace>http://www.kartverket.no/kartografiseksjon/N50/so</base:namespace>
               <base:versionId xsi:nil="true" nilReason="inapplicable"/>
             </base:Identifier>
           </hy-p:inspireId>
           <hy-p:origin xsi:nil="true" nilReason="unknown"/>
           <hy-p:waterLevelCategory xsi:nil="true" nilReason="unknown"/>
         </hy-p:LandWaterBoundary>
       </wfs:member>
     </wfs:FeatureCollection>'

* Create Path parser config for featuretype  hy-p:LandWaterBoundary  using GetFeature response

        '"hy-p:LandWaterBoundary": [   <--(EDIT) featuretype name (element name after wfs:member)
             {
               "type": "Path",
               "request_template": "/fi/nls/oskari/fe/input/request/wfs/generic/ELF_generic_wfs_template.xml", <-- same for all Path parsers
               "response_template": "fi.nls.oskari.eu.elf.recipe.universal.ELF_wfs_Parser",   <-- same for all Path parsers
               "parse_config": {
                 "scan": {   <--  parent xml element for featuretype element
                   "scanNS": "http://www.opengis.net/wfs/2.0",
                   "name": "member"
                 },
                 "root": {
                   "rootNS": "urn:x-inspire:specification:gmlas:HydroPhysicalWaters:3.0",  <--(EDIT) is same as "feature_namespace_uri"
                   "name": "LandWaterBoundary"  <--(EDIT) featuretype name without prefix
                 },
                 "paths": [   <-- Properties to be parsed out for the featuretype
                   {
                     "path": "/hy-p:LandWaterBoundary/@gml:id",   <---(EDIT) "@" means that mapping is an attribute xml element (gml:id is mandatory attribute in wfs 2.x)
                     "type": "String",   <-- Supported types "String", "Object", "Geometry"
                     "label": "id"   <-- shortcut name for the path property name
                   },
                   {
                     "path": "/hy-p:LandWaterBoundary/hy-p:inspireId/base:Identifier/base:localId", <--(EDIT) add all element/property names under featutype element for the requested scan path
                     "type": "String",
                     "label": "InspireLocalId"
                   },
                   {
                     "path": "/hy-p:LandWaterBoundary/hy-p:beginLifespanVersion",
                     "type": "String",
                     "label": "Lifespan"
                   },
                   {
                     "path": "/hy-p:LandWaterBoundary/hy-p:geometry",  <--(EDIT) parent element of gml geometry property element
                     "type": "Geometry",
                     "label": "geom"   <-- use this same generic name
                   }
                 ]
               },
               "sdl_style": "/fi/nls/oskari/fe/output/style/inspire/gn/nls_fi.xml"
             }
           ],'

* Add initial config row to oskari_wfs_parser_config table

        'INSERT INTO oskari_wfs_parser_config ( name, type, request_template, response_template, parse_config) VALUES ('hy-p:LandWaterBoundary', 'Path', '/fi/nls/oskari/fe/input/request/wfs/generic/ELF_generic_wfs_template.xml', 'fi.nls.oskari.eu.elf.recipe.universal.ELF_wfs_Parser', '{"paths":[{"path":"/hy-p:LandWaterBoundary/@gml:id","label":"id","type":"String"},{"path":"/hy-p:LandWaterBoundary/hy-p:inspireId/base:Identifier/base:localId","label":"InspireLocalId","type":"String"},{"path":"/hy-p:LandWaterBoundary/hy-p:beginLifespanVersion","label":"Lifespan","type":"String"},{"path":"/hy-p:LandWaterBoundary/hy-p:geometry","label":"geom","type":"Geometry"}],"root":{"rootNS":"urn:x-inspire:specification:gmlas:HydroPhysicalWaters:3.0","name":"LandWaterBoundary"},"scan":{"scanNS":"http://www.opengis.net/wfs/2.0","name":"member"}}');
        '

** WFS 2.0.0 parser config setup is under development and later on there is user interface to edit Path config in Oskari Admin:layerselector.

## 6. Commented example of path parser config  (portti_wfs_template_model.parse_config column and oskari_wfs_parser_config.parse_config/ json format)


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

